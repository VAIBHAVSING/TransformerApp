from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# Initialize the Flask app
app = Flask(__name__)

# Load the pre-trained model
model = joblib.load('pt_error_predictor.pkl')

# Enable CORS (Cross-Origin Resource Sharing) to allow access from frontend apps
CORS(app)

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




# Prediction route
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
        prediction = model.predict(input_df)[0]

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

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
