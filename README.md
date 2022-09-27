# Barbequery
The perfect library for easily cooking up some spicy HTML GUIs. 
Basically it's a lightweight version of JQuery but with some differences

## Usage
Almost all methods return the this element allowing you to link many methods together for example:
```js
$("div").html("hello world").css({color: "red"}).appendTo(document.body)
```

### Selecting element by id
```js
var el = $("#id")
```
    
### Selecting elements by class name
```js
var els = $(".class-name")
```
    
### Creating elements
```js
var el = $("div") // create an element of a native type
var el = $("div", "Hello World", {color: "red"}) // create an element of a native type and setting html and css
```

### Creating components
```js
var exampleComponent = $.createComponent("MyComponent", $.html`
    <p style="border: 1px solid green;">
        <strong>Hello:</strong>
        <span>\{name} is \n the \h  best</span>
    </p>
`)
```
    
### Deleting components (note: deletes the component type, not individual components)
```js
$.deleteComponent("MyComponent")
```

### Using components
```js
var el = $("MyComponent", {name: "Bob"}) // create a custom component using $
var el = exampleComponent({name: "Bob"}); // create a custom element using the function that is returned from the createComponent method
```

### Setting HTML
```js
el.html("Example test")
```

### Setting innerText
```js
el.text("Example test")
```

### Setting CSS
```js
// using string of css code
el.css(`
    color: red;
    font-size: 18px;
    font-family: sans-serif;
    border: 2px dashed blue;
`)
// using object of key/value pairs
.css({
    color: "red",
    fontSize: "18px",
    fontFamily: "sans-serif",
    border: "2px dashed blue"
})
```

### Appending this element to another
```js
el.appendTo(document.body)
```

### Appending another element to this element
```js
el.append(anotherEl)
```

### Adding classes
```js
el.addClass("example-class1", "example-class2")
```

### Removing classes
```js
el.removeClass("example-class1", "example-class2")
```

### Setting id
```js
el.setId("example-id")
```

### Setting arbitrary properties
```js
el.attr("width", "400")
el.attr({width: 400})
```

### Adding an event listener
```js
el.on("mouseup", function (e) {
    console.log("hello", e);
});
```

### Parsing strings as psuedo-template literals
```js
$.template("My name is ${name}", {name: "Bob"});
```

### Fetching a JSON response using the fetch API
```js
$.getJSON("https://example.com/API/endpoint", function (data) {
    console.log(data);
});
```

### Fetching a JSON response using JSONP
```js
$.getJSONLegacy("https://example.com/API/endpoint", function (data) {
    console.log(data);
});
```
