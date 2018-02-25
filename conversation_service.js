// Example 4: implements app actions.
//var prompt = require('prompt-sync')();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

// Set up Conversation service wrapper.
 window.conversation = new ConversationV1({
  username: '62c028a8-814f-499f-92b7-cd19884de4ac', // replace with service username
  password: 'aXVgNhLkOPYL', // replace with service password
  version_date: '2017-05-26'
});

var workspace_id = 'c84df8e6-af10-45b5-9c09-4d5355dd74e7'; // replace with workspace ID
console.log("LOADED-----------")
// Start conversation with empty message.
conversation.message({
  workspace_id: workspace_id
  }, processResponse);

// Process the conversation response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  var endConversation = false;

  // Check for action flags.
  if (response.output.action === 'display_time') {
    // User asked what time it is, so we output the local system time.
    console.log('The current time is ' + new Date().toLocaleTimeString());
  } else if (response.output.action === 'close') {
    // User said goodbye, so we're done.
    console.log(response.output.text[0]);
    endConversation = true;
  } else {
    // Display the output from dialog, if any.
    if (response.output.text.length != 0) {
        console.log(response.output.text[0]);
    }
  }

//alert(response.output);
  // If we're not done, prompt for the next round of input.
  if (!endConversation) {
    conversation.message({
      workspace_id: workspace_id,
      input: { text: newMessageFromUser },
      // Send back the context to maintain state.
      context : response.context,
    }, processResponse)
  }
}