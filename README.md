# Barbequery
🔥 The perfect library for easily cooking up some spicy HTML GUIs

## Reasons to use Barbequery
☁️ lightweight (only 7% of JQuery's file size)

⚡ fast (no more waiting for your JSX to compile)

🧠 extremely simple to use (especially if you familiar with JQuery or React)

✨ modern (ES6+ JavaScript syntax support)

## Usage
Almost all methods return the `this` Barbequery element allowing you to link many methods together for example:
```js
$("div").html("hello world").css("color: red").appendTo(document.body)
```

### Selecting element by id
```js
$("#id")
```
    
### Selecting elements by class name
```js
$(".class-name")
```

### Selecting elements by tag name
```js
$("*div")
```

## Multi selectors
```js
// select all elements that have both the "class1" class and an id of "myId"
$(".class1 & #myId")

// select all elements that are either a <div> or have the "myClass" class
$("*div | .myClass")
```

### Nested selectors
```js
// select all <a> tags that are inside of an <div> that are also inside of an element that has the "example" class
var els = $(".example > *div > *a")
```

### Nested multi selectors
```js
// select all elements that have class1 or both class2 and class3 and that are also inside of a <div> element
$("*div > .class1 | (.class2 & .class3)")
```
    
### Creating elements
```js
$("div") // create an element of a native type
```

### Creating components
Lets call the object parameter which is used when creating an instance of a component the initialization object. Use `\{propertyName}` to insert a value from the initialization object into the code. You can also access subproperties from the initiliazation object like so `\{prop1.prop2}`
The `$.html` is necessary if you are going to use value inserts, otherwise it is not necessary
```js
var exampleComponent = $.createComponent("MyComponent", $.html`
    <p style="border: 2px solid green;">
        <strong>NAME: \{name}</strong>
        <br>
        <span>job: \{job} \n \t example</span>
    </p>
`, (initObj, rawElement) => {
    // this is the callback that gets run when the element is created
    // args is an array containing the initialization object and the raw new element
    console.log(this); // this references the new Barbequery element
})

// you can also create new components that use previously defined components
// you can give input to those components in the opening tag of the component
$.createComponent("ParentComponent", $.html`
    <div style="border: 2px solid blue;">
        <MyComponent name="Tom" job="unemployed">
        <MyComponent/>
    </div>
`)
```
    
### Deleting components (note: deletes the component type, not individual components)
```js
$.deleteComponent("MyComponent")
```

### Using components
```js
var el = $("MyComponent", {name: "bob", job: "lawyer"}) // create a custom component using $
var el = exampleComponent({name: "bob", job: "lawyer"}); // create a custom element using the function that is returned from the createComponent method
var el = $("ParentComponent").appendTo(document.body) // create a custom component that uses sub-components
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

### Appending this element to another element
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
