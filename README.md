# Facial Analysis and Article Generation Lambda Function

This AWS Lambda function analyzes images uploaded to an S3 bucket using Amazon Rekognition to detect faces and extract facial attributes such as age range, gender, and emotion. It then utilizes the OpenAI API to generate news articles based on the detected facial attributes of a hypothetical UPOU student.

## Setup

1. Ensure you have an AWS account with the necessary permissions to create Lambda functions and access S3 and Rekognition services.

2. Install the necessary Node.js dependencies by running `npm install` in your project directory.

3. Set up your AWS credentials or IAM role to enable the Lambda function to access the required services.

4. Obtain an API key for the OpenAI API and either replace `process.env.OPEN_API_KEY` with your API key or add it as an environment variable in your Lambda instance.

## Usage

1. Upload images to the specified S3 bucket.

2. The Lambda function will be triggered automatically upon image upload events in the S3 bucket.

3. Amazon Rekognition will analyze the uploaded image to detect faces and extract facial attributes.

4. Based on the detected facial attributes, the Lambda function will make a request to the OpenAI API to generate a news article about a UPOU student with similar attributes.

5. The generated article will be stored in the same S3 bucket under the `articles` directory with the filename `${filename}-article.txt`.

6. The Lambda function will return the URL of the generated article stored in S3.

## Configuration

- Ensure that the required AWS SDK for Node.js and Axios dependencies are installed (`aws-sdk`, `axios`).

- Set up environment variables or replace placeholders in the code with your actual API keys and configuration parameters.

## Notes

- This Lambda function is designed to be triggered by S3 events upon image upload. Ensure proper S3 bucket configuration and event setup.

- Error handling is implemented to catch and log any internal server errors encountered during execution.

