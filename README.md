# HMPI Flask App

This is a Python Flask application that calculates Heavy Metal Pollution Indices (HMPI) for groundwater samples.

## How to Run

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the app:
   ```
   python app.py
   ```

The app will run on http://localhost:3001

## How to Test

### Method 1: Using the Test Script
Run the test script to see results:
```
python test_app.py
```

### Method 2: Change Test Data
Edit `test.json` to change the input data:
```json
{
  "heavyMetalConcentrations": {
    "lead": 0.02,
    "cadmium": 0.003,
    "arsenic": 0.015,
    "mercury": 0.001,
    "chromium": 0.04
  }
}
```

Then run:
```
python test_app.py
```

### Method 3: Using curl
Send a POST request:
```
curl -X POST http://localhost:3001/api/hmpi/calculate \
  -H "Content-Type: application/json" \
  -d @test.json
```

### Method 4: Using Python Requests
Modify `test_app.py` with your data and run it.

## API Endpoint

- **URL**: `/api/hmpi/calculate`
- **Method**: POST
- **Input**: JSON with `heavyMetalConcentrations` object
- **Output**: JSON with HPI, HEI, MI, Cd, Nemerow, and classification

## Example Output
```
HMPI Calculation Results:
HPI: 100.99
HEI: 5.47
MI: 5.47
Cd: 0.47
Nemerow: 1.61
Classification: Unsafe
