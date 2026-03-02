// controllers/chatbotController.js
import AdminUser from '../model/adminModel.js'; // **Corrected to default import (no curly braces)**
import FinanceUser from '../model/financeModel.js'; // **Corrected to default import**
import CoreUser from '../model/coreModel.js'; // **Corrected to default import**
import HrUser from '../model/hrModel.js'; // **Corrected to default import**
import LogisticUser from '../model/logisticModel.js'; // **Corrected to default import**
import * as dialogflow from '@google-cloud/dialogflow';

export const dialogflowWebhook = async (req, res) => {
    const agent = new dialogflow.WebhookClient({
        request: req,
        response: res,
    });

    console.log('Dialogflow Request Headers: ' + JSON.stringify(req.headers));
    console.log('Dialogflow Request Body: ' + JSON.stringify(req.body));

    // **Model Mapping:** Define a mapping of department names to Mongoose models
    const departmentModels = {
        'admin': AdminUser,
        'finance': FinanceUser,
        'core': CoreUser,
        'hr': HrUser,
        'logistic': LogisticUser,
        // Add more departments and their models as needed, ensure keys are lowercase to match entity values
    };


    function handleGetAccountCountByDepartment(agent) {
        const departmentName = agent.parameters.department; // Get the department parameter from Dialogflow (entity value)

        if (!departmentName) {
            agent.add("Please specify a department to get the account count.");
            return;
        }

        // **Get the Mongoose model based on the department name (lowercase for consistency)**
        const DepartmentModel = departmentModels[departmentName.toLowerCase()];

        if (!DepartmentModel) {
            agent.add(`Sorry, I don't recognize the department: ${departmentName}. Please select from HR, Finance, Core, Admin, or Logistic.`);
            return; // Department not found in mapping
        }


        return DepartmentModel.countDocuments({}) // Use the dynamically chosen model to count documents
            .then(count => {
                agent.add(`The Total Account Created in ${departmentName} Department is ${count}`);
            })
            .catch(error => {
                console.error(`Error fetching account count for ${departmentName} department:`, error);
                agent.add(`Sorry, I encountered an error while fetching the account count for the ${departmentName} department.`);
            });
    }


    let intentMap = new Map();
    intentMap.set('GetAccountCountByDepartmentIntent', handleGetAccountCountByDepartment);

    try {
        await agent.handleRequest(intentMap);
    } catch (error) {
        console.error("Error handling Dialogflow request:", error);
        res.status(500).send("Error processing Dialogflow webhook");
    }
};

export const sendMessageToDialogflow = async (req, res) => {
    const userMessage = req.body.text;

    if (!userMessage) {
        return res.status(400).json({ error: "No message text provided" });
    }

    try {
        const projectId = 'newagent-dknu'; 
        const sessionId = 'backend-session-id';
        const languageCode = 'en-US';

        const sessionClient = new dialogflow.SessionsClient();

        // **Correct way to create sessionPath (static method call):**
        const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId); // **Use projectAgentSessionPath**

        const dialogflowRequest = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: userMessage,
                    languageCode: languageCode,
                },
            },
        };

        const responses = await sessionClient.detectIntent(dialogflowRequest);
        const dialogflowResponse = responses[0].queryResult;

        const chatbotMessages = [];
        if (dialogflowResponse.fulfillmentMessages) {
            dialogflowResponse.fulfillmentMessages.forEach(message => {
                if (message.text) {
                    message.text.text.forEach(line => {
                        chatbotMessages.push(line);
                    });
                }
            });
        }

        const backendResponse = {
            messages: chatbotMessages,
            intentName: dialogflowResponse.intent?.displayName || null,
        };

        res.json(backendResponse);

    } catch (error) {
        console.error("Backend error calling Dialogflow API:", error);
        res.status(500).json({ error: "Failed to communicate with Dialogflow" });
    }
};