/**
 * Mr. Speechie — Appointment form receiver.
 * Appends each form submission as a new entry in the Google Doc:
 * https://docs.google.com/document/d/1FVJ2LFqx90IHK1oWO7x0byU0EAc4jj7s82_7NdtSIRQ/edit
 *
 * NOTE: A Google Doc stores each submission as plain text appended to the
 * bottom of the document, one after another. It works, but it isn't
 * searchable/sortable/filterable the way a spreadsheet is. If you later
 * want to filter or sort appointment requests (by date, by child's name,
 * etc.), a Google Sheet is the better fit — just say so and I'll switch
 * this back.
 *
 * SETUP:
 * 1. Open the Google Doc:
 *    https://docs.google.com/document/d/1FVJ2LFqx90IHK1oWO7x0byU0EAc4jj7s82_7NdtSIRQ/edit
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any starter code in the editor and paste in this entire file.
 * 4. Click Deploy > New deployment.
 *    - Click the gear icon next to "Select type" and choose "Web app".
 *    - Description: anything you like (e.g. "Appointment form").
 *    - Execute as: Me.
 *    - Who has access: Anyone.
 * 5. Click Deploy. The first time, Google will ask you to authorize the
 *    script — click through the prompts (Advanced > Go to project (unsafe)
 *    is expected and safe here, since this is your own script).
 * 6. Copy the "Web app URL" shown after deployment (it ends in /exec).
 * 7. Open script.js from the website files, find the line:
 *      const APPOINTMENT_WEBAPP_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
 *    and replace the placeholder text with the URL you just copied.
 * 8. Re-upload script.js to your hosting. Test the form once — the
 *    submission should appear as new text at the bottom of the Doc.
 *
 * If you ever edit and re-save this script, you'll need to create a new
 * deployment (Deploy > Manage deployments > Edit > New version) for the
 * changes to take effect on the live form.
 */

var DOC_ID = '1FVJ2LFqx90IHK1oWO7x0byU0EAc4jj7s82_7NdtSIRQ';

function doPost(e) {
  var doc = DocumentApp.openById(DOC_ID);
  var body = doc.getBody();
  var data = JSON.parse(e.postData.contents);

  body.appendParagraph('New Appointment Request — ' + new Date().toLocaleString())
      .setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph('Child: ' + (data.childFirstName || '') + ' ' + (data.childLastName || ''));
  body.appendParagraph('Gender: ' + (data.gender || ''));
  body.appendParagraph('Age: ' + (data.age || ''));
  body.appendParagraph('Contact Person: ' + (data.contactName || ''));
  body.appendParagraph('Relationship to Child: ' + (data.relationship || ''));
  body.appendParagraph('Email: ' + (data.email || ''));
  body.appendParagraph('Mobile: ' + (data.mobile || ''));
  body.appendParagraph('Concerns: ' + (data.concerns || ''));
  body.appendHorizontalRule();

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}