from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

# Initialize the Flask app
app = Flask(__name__)

# Get allowed origins from environment variable or use default
cors_origins = os.environ.get('CORS_ORIGIN', 'http://localhost:5173,http://localhost:3000').split(',')

# Enhanced CORS configuration with specific allowed origins
CORS(app, resources={r"/*": {
    "origins": cors_origins, 
    "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    "supports_credentials": True
}})

# Add a health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Model API is running"}), 200

# Load the pre-trained model
pt_model = joblib.load('pt_error_predictor.pkl')
ct_model = joblib.load("ct_error_predictor_model_all_outputs.joblib")

import re

# Helper function to extract numeric values from a string
def extract_numeric_value(value):
    match = re.search(r"[\d.]+", value)  # Match digits and decimal points
    return float(match.group(0)) if match else 0

# Helper function to prepare the model input
def prepare_model_input(form_data, output_data):
    try:
        # Extract and process the formData
        burden = float(form_data.get("burden", 0))  # Default to 0 if not provided
        class_ = form_data.get("class", "1.0")  # Default to '1.0' if not provided
        
        # Extract and process the outputData
        cross_section_str = output_data.get("crossSection", "0")  # Default to '0' if not provided
        wire_length_str = output_data.get("wireLength", "0")  # Default to '0' if not provided
        insulation_on_core_str = output_data.get("insulationOnCore", "0")  # Default to '0' if not provided
        num_layers_str = output_data.get("numOfLayers", "1")  # Default to '1' if not provided

        # Extract numeric values from the strings
        cross_section = extract_numeric_value(cross_section_str)
        wire_length = extract_numeric_value(wire_length_str)
        insulation_on_core = extract_numeric_value(insulation_on_core_str)
        num_layers = int(extract_numeric_value(num_layers_str))  # Extract numeric value and convert to int

        # Round off the numerical values for the model input
        cross_section = round(cross_section, 2)
        wire_length = round(wire_length, 2)
        insulation_on_core = round(insulation_on_core, 2)

        # Estimate additional fields based on the provided data
        bdv_oil = 25 + 0.1 * wire_length
        primary_to_secondary = cross_section * num_layers * 10
        primary_to_earth = primary_to_secondary + insulation_on_core * 5
        secondary_to_earth = primary_to_earth - 100

        # Return the processed data as a dictionary
        return {
            "Burden": burden,
            "class": class_,
            "BDVOil": round(bdv_oil, 2),
            "PrimarytoSecondary": round(primary_to_secondary, 2),
            "PrimarytoEarth": round(primary_to_earth, 2),
            "SecondarytoEarth": round(secondary_to_earth, 2)
        }
    
    except Exception as e:
        # If there's an error in processing, return a message
        print(f"Error in preparing model input: {e}")
        return {}




# Prediction route for /predict
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the data from the POST request
        data = request.get_json()

        # Extract formData and outputData
        form_data = data.get("formData", {})
        output_data = data.get("outputData", {})

        # Prepare the model input
        model_input = prepare_model_input(form_data, output_data)

        # Check if the model_input is valid
        if not model_input:
            return jsonify({"error": "Invalid input data"}), 400

        # Convert the model input into a DataFrame for prediction
        input_df = pd.DataFrame([model_input])

        # Get the model prediction
        prediction = pt_model.predict(input_df)[0]

        # Return the prediction results as a JSON response
        return jsonify({
            'Ratio100Error120': prediction[0],
            'Ratio100Error100': prediction[1],
            'Ratio100Error80': prediction[2],
            'Phase100Error120': prediction[3],
            'Phase100Error100': prediction[4],
            'Phase100Error80': prediction[5]
        })
    
    except Exception as e:
        # If there's any error, return a 500 error with the error message
        return jsonify({"error": f"An error occurred: {e}"}), 500

def extract_ratio_numerator(ratio_str):
    try:
        # Replace ":" with "/" if needed
        ratio_str = ratio_str.replace(":", "/")
        parts = ratio_str.split("/")
        return float(parts[0]) if len(parts) == 2 else float(ratio_str)
    except Exception:
        raise ValueError(f"Invalid ctRatio format: {ratio_str}")
    
    

def calculate_derived_inputs(form_data):
    try:
        required_keys = ['type', 'class', 'voltageRating', 'ctRatio', 'burden', 'stc']
        for key in required_keys:
            if key not in form_data:
                raise ValueError(f"Missing required field: {key}")

        type_value = form_data['type'].lower()
        type1 = 1 if "t/b" in type_value else 0
        type2 = 1 if "oil" in type_value else 0

        class_map = {
            "0.2": 0.2, "0.5": 0.5, "1": 1.0, "3": 3.0
        }
        class_val = class_map.get(str(form_data["class"]).strip(), 0.5)

        try:
            voltage_rating = float(form_data["voltageRating"])
        except ValueError:
            raise ValueError("Invalid voltage rating. Must be a numeric value.")

        bdv_oil = 30 if type2 == 1 else 20
        ptos = 1000 + voltage_rating * 10
        ptoe = 500 + voltage_rating * 5
        stoe = 600 + voltage_rating * 4

        return {
            "CTRatio": extract_ratio_numerator(form_data["ctRatio"]),
            "Burden": form_data["burden"],
            "STC": form_data["stc"],
            "Type1": type1,
            "Type2": type2,
            "class": class_val,
            "BDVOil": bdv_oil,
            "PrimarytoSecondary": ptos,
            "PrimarytoEarth": ptoe,
            "SecondarytoEarth": stoe
        }

    except Exception as e:
        raise ValueError(f"Error in calculating derived inputs: {e}")

# Prediction route for /predict_ct (renamed the function to avoid conflict)
# Prediction route for /predict_ct
@app.route('/predict_ct', methods=['POST'])
def predict_ct():
    try:
        data = request.get_json()

        form_data = {
            "type": data.get("type"),
            "burden": float(data.get("burden")),
            "voltageRating": float(data.get("voltageRating")),
            "class": data.get("class"),
            "ctRatio": data.get("ctRatio"),
            "stc": float(data.get("stc"))
        }

        # Calculate derived inputs
        derived_inputs = calculate_derived_inputs(form_data)

        features = [
            float(derived_inputs['CTRatio']),
            float(derived_inputs['Burden']),
            float(derived_inputs['STC']),
            float(derived_inputs['Type1']),
            float(derived_inputs['Type2']),
            float(derived_inputs['class']),
            float(derived_inputs['BDVOil']),
            float(derived_inputs['PrimarytoSecondary']),
            float(derived_inputs['PrimarytoEarth']),
            float(derived_inputs['SecondarytoEarth']),
        ]

        # Define column names expected by the model
        columns = [
            "CTRatio", "Burden", "STC", "Type1", "Type2", "class",
            "BDVOil", "PrimarytoSecondary", "PrimarytoEarth", "SecondarytoEarth"
        ]

        # Create DataFrame with appropriate column names
        input_df = pd.DataFrame([features], columns=columns)

        # Predict using the ct_model
        raw_prediction = ct_model.predict(input_df)

        # Log the raw prediction output to check if any data is missing
        # print("Raw Prediction:", raw_prediction)

        # Ensure prediction has 20 outputs (even if the model only outputs fewer values)
        prediction = list(raw_prediction[0]) + [None] * (20 - len(raw_prediction[0]))

        output_keys = [
            "Ratio100Error120", "Ratio100Error100", "Ratio100Error20",
            "Ratio100Error5", "Ratio100Error1", "Phase100Error120",
            "Phase100Error100", "Phase100Error20", "Phase100Error5",
            "Phase100Error1", "Ratio25Error120", "Ratio25Error100",
            "Ratio25Error20", "Ratio25Error5", "Ratio25Error1",
            "Phase25Error120", "Phase25Error100", "Phase25Error20",
            "Phase25Error5", "Phase25Error1"
        ]

        # Map the model's prediction to the output keys
        output = dict(zip(output_keys, [float(x) if x is not None else None for x in prediction]))

        # print("Mapped Prediction Output:", output)

        return jsonify(output)

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Run the app
if __name__ == '__main__':
    app.run(debug=True)