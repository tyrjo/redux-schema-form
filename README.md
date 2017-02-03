# Redux Schema Forms

A modified fork of [react-schema-form](https://github.com/networknt/react-schema-form).
 
## Goals:

* Grommet form elements instead of material-ui
* Intermediate form state stored in Redux
* Pre-populated forms
* Validation

## Usage:

A schema describes the acceptable form data values, including any validation requirements.  A form describes which UI elements to use to
collect user input for each data value.  The mapper links a generic form type (like "text" or "select")
to a specific React component that displays the form item in a style that matches your application.

The onSubmit function is given a single parameter which is an object with keys for each data element in the schema, with the values
supplied by user input.

Each form component gets a form object for just its portion of the form. Any properties set on that
form are provided as props to the React component.

All intermediate state, including current validation results is stored in Redux while the form is mounted.


* Form syntax: [angular-schema-form](https://github.com/json-schema-form/angular-schema-form)
* Schema syntax: [json schema](https://spacetelescope.github.io/understanding-json-schema/index.html)

### Example:
```
this.schema = {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "maxLength": 200,
        },
        "description": {
          "type": "string",
          "maxLength": 500,
        },
      },
      "required": [
        "title",
        "description",
      ],
    };
    this.form = [
      {
        key: "theform",
        type: "form",
        title: "Report a bug",
        items: [
          {
            key: "title",
            type: "text",
          },
          {
            key: "description",
            type: "textarea",
            rows: 5,
          },
          {
            type: "actions",
            items: [
              {
                key: "cancel",
                type: "button",
                title: "Cancel",
                onClick: this.onCancel,
              },
              {
                key: "submit",
                type: "submit",
                title: "Submit",
                onClick: this.onSubmit,
              },
            ],
          },
        ],
      },
    ];
    this.model = {};

<GrommetForm
  id="Myform"
  schema={this.schema}
  form={this.form}
  model={this.model}
  onSubmit={this.onSubmit}
/>
```



