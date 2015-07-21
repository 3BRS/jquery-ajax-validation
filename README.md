# jQuery AJAX form validation

## Expected data format
```json
{
    "success": false,
    "errors": {
        "email": ["Email is not valid"],
        "password": ["Password is not valid", "Password is too short"]
    }
}
```

## Options
* **submitUrl**  
    *default: action of the form*  
* **redirectUrl**  
    *default: action of the form*  
* **inputsSelector**  
    *default: 'input, select, textarea'*  
* **inputWrapperSelector**  
    Element that wraps the input  
    *default: '.form-group'*  
* **successClass**  
    Class that will be appended to inputs, that have no errors  
    *default: 'has-success'*  
* **errorClass**  
    Class that will be appended to inputs, that have errors  
    *default: 'has-error'*  
* **errorElement**  
    Element Containing error message, will be appended after the input with error  
    *default: '\<div class="form-error">\</div>'*  
* **debug**  
    Prints some debugging info  
    *default: false*  
    
## Callbacks
* **onError($input, errors, $form)**  
* **onValid($input, $form)**
* **beforeValidation($form)**
* **onValidationReceived(data, $form)**
* **beforeRedirect($form)**
