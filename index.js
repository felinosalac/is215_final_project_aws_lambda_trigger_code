const AWS = require('aws-sdk');
const axios = require('axios');

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

exports.handler = async(event) => {
    try {
        // Get the S3 bucket name and object key from the event
        const bucket = event.Records[0].s3.bucket.name;
        const filename = event.Records[0].s3.object.key;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

        // Call the facial analysis function to get labels for the uploaded image
        const rekognitionParams = {
            Image: {
                S3Object: {
                    Bucket: bucket,
                    Name: key
                }
            },
            Attributes: [
                "ALL"
            ]
        };
        const response = await rekognition.detectFaces(rekognitionParams).promise();

        console.log(response);


        const rekognitionResponse = response;

        // Extract the selected node or label from the response
        const ageRange = response.FaceDetails[0].AgeRange.Low;
        const gender = response.FaceDetails[0].Gender.Value;
        const emotion1 = response.FaceDetails[0].Emotions[0].Type;

        console.log("ageRange", ageRange);
        console.log("gender", gender);
        console.log("emotion1", emotion1);


        // Call the OpenAI API to generate articles based on the selected node
        const openaiEndpoint = 'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions';
        const openaiApiKey = process.env.OPEN_API_KEY; // Replace with your OpenAI API key, or add it as an Environment Variable in your Lambda instance


        console.log("const headers");
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + openaiApiKey
        };
        console.log("const headers", headers);

        
        console.log("const data");
        const data = {
            prompt: `Generate news article about a UPOU student that has the following qualities: age:${ageRange}, gender:${gender}, emotion:${emotion1}. Add a catchy title`,
            max_tokens: 500
        };

        console.log("const data", data);

        console.log("openaiResponse");
        const openaiResponse = await axios.post(openaiEndpoint, data, { headers });
        console.log("openaiResponse", openaiResponse);


        console.log("openaiResult");
        const openaiResult = openaiResponse.data;
        console.log("openaiResult", openaiResult);

        console.log("articles");
        const articles = openaiResult.choices[0].text;
        console.log("articles", articles);

        // Store the generated article in a new S3 bucket
        const resultBucket = bucket;
        

        console.log("resultKey");
        const resultKey = `articles/${filename}-article.txt`;
        console.log("resultKey", resultKey);

        console.log("await s3.putObject");
        await s3.putObject({
            Bucket: resultBucket,
            Key: resultKey,
            Body: articles
        }).promise();
        console.log("await s3.putObject end");

        console.log("articleUrl");
        const articleUrl = `https://s3.amazonaws.com/${resultBucket}/${filename}`; 
        console.log("articleUrl", articleUrl);

        return {
            statusCode: 200,
            body: JSON.stringify({ articleUrl: articleUrl })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
