const questionsData = {
  "html-basics": [
    {
      "title": "What is HTML?",
      "answer": "HTML (HyperText Markup Language) is the standard language used to create and structure content on the web. It defines the structure of webpages using elements and tags."
    },
    {
      "title": "What is the structure of a basic HTML page?",
      "answer": "A basic HTML page includes:\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>Page Title</title>\n  </head>\n  <body>\n    <p>Hello World</p>\n  </body>\n</html>"
    },
    {
      "title": "What is an HTML tag?",
      "answer": "An HTML tag is a container for content or other tags. Example: <p>This is a paragraph</p>"
    },
    {
      "title": "What are HTML comments?",
      "answer": "Comments are notes in the code that are not displayed in the browser. Syntax: <!-- This is a comment -->"
    },
    {
      "title": "Are HTML tags case-sensitive?",
      "answer": "No, HTML tags are not case-sensitive. <p> is the same as <P>."
    },
    {
      "title": "What is the role of attributes in HTML?",
      "answer": "Attributes provide additional information about elements. They are written inside the opening tag.\nExample: <a href='https://google.com'>Google</a>"
    },
    {
      "title": "What is the anchor tag used for?",
      "answer": "The <a> tag is used to create hyperlinks.\nExample: <a href='https://google.com'>Google</a>"
    },
    {
      "title": "How do you add an image in HTML?",
      "answer": "Use the <img> tag with src and alt attributes.\nExample: <img src='image.jpg' alt='Sample Image'>"
    },
    {
      "title": "What is the difference between <div> and <span>?",
      "answer": "<div> is a block-level container, while <span> is an inline container for text or inline elements."
    },
    {
      "title": "What are heading tags?",
      "answer": "HTML provides six levels of headings from <h1> (most important) to <h6> (least important).\nExample: <h1>Main Heading</h1>"
    },
    {
      "title": "What is the paragraph tag used for?",
      "answer": "The <p> tag defines a paragraph of text.\nExample: <p>This is a paragraph.</p>"
    },
    {
      "title": "How do you insert a line break in HTML?",
      "answer": "Use the <br> tag to insert a new line.\nExample: Line 1<br>Line 2"
    },
    {
      "title": "What does the <hr> tag do?",
      "answer": "<hr> creates a horizontal line on the webpage to separate sections."
    },
    {
      "title": "What is the <pre> tag?",
      "answer": "The <pre> tag displays text exactly as written in the HTML file, preserving spaces and line breaks."
    },
    {
      "title": "What are semantic tags?",
      "answer": "Semantic tags clearly describe their meaning in a human- and machine-readable way.\nExamples: <header>, <footer>, <main>, <section>, <article>, <aside>"
    },
    {
      "title": "How do you make an image clickable?",
      "answer": "Wrap the <img> tag inside an <a> tag.\nExample: <a href='link'><img src='image.jpg'></a>"
    },
    {
      "title": "What is a list in HTML?",
      "answer": "Lists organize content. Types:\n<ul> for unordered list, <ol> for ordered list. Items are defined using <li>."
    },
    {
      "title": "What are tables in HTML?",
      "answer": "Tables represent tabular data.\nExample:\n<table>\n  <tr><th>Name</th><th>Roll No</th></tr>\n  <tr><td>Alice</td><td>101</td></tr>\n</table>"
    },
    {
      "title": "What is the purpose of <thead> and <tbody>?",
      "answer": "<thead> groups the header content, <tbody> groups the body content of a table."
    },
    {
      "title": "What is colspan in HTML?",
      "answer": "The colspan attribute allows a cell to span across multiple columns.\nExample: <td colspan='2'>Merged Cell</td>"
    },
    {
      "title": "What is a form in HTML?",
      "answer": "Forms collect user input and can be submitted to a server.\nExample:\n<form action='/submit'>\n  <input type='text' placeholder='Enter name'>\n</form>"
    },
    {
      "title": "What is the use of the action attribute in a form?",
      "answer": "The action attribute defines where to send the form data after submission.\nExample: <form action='/submit'>"
    },
    {
      "title": "How do you create radio buttons?",
      "answer": "<input type='radio' name='class' value='X'>\nTo group them, use the same name attribute."
    },
    {
      "title": "How do you create checkboxes?",
      "answer": "<input type='checkbox' name='option' value='1'>\nEach checkbox can be selected independently."
    },
    {
      "title": "What is a textarea?",
      "answer": "<textarea> is used to take multiline input from users.\nExample: <textarea placeholder='Write here...'></textarea>"
    },
    {
      "title": "What is the select tag in HTML?",
      "answer": "<select> creates a dropdown list.\nExample:\n<select>\n  <option>Delhi</option>\n  <option>Mumbai</option>\n</select>"
    },
    {
      "title": "What is an iframe?",
      "answer": "An <iframe> is used to embed another webpage inside the current page.\nExample: <iframe src='page.html'></iframe>"
    },
    {
      "title": "How do you add a video in HTML?",
      "answer": "Use the <video> tag with src and attributes like controls, autoplay, loop.\nExample: <video src='video.mp4' controls></video>"
    },
    {
      "title": "What is the difference between id and class in HTML?",
      "answer": "id is unique for each element, while class can be used by multiple elements.\nExample: <div id='header'> vs. <div class='menu'>"
    }
  ],

  "css-basics": [
    {
      "title": "What is CSS?",
      "answer": "CSS (Cascading Style Sheets) is a styling language used to describe the look and formatting of an HTML document.\nExample: h1 { color: red; }"
    },
    {
      "title": "What are different ways to apply CSS?",
      "answer": "1. Inline CSS (in the tag)\n2. Internal CSS (inside <style> tag in HTML)\n3. External CSS (linked CSS file — best practice)\nExample: <link rel=\"stylesheet\" href=\"style.css\">"
    },
    {
      "title": "What is a CSS selector?",
      "answer": "Selectors are used to target HTML elements.\nTypes: Universal (*), Element (h1), Class (.myClass), ID (#myId)\nExample: .box { background-color: blue; }"
    },
    {
      "title": "What are text properties in CSS?",
      "answer": "Common text properties include:\ntext-align, text-decoration, font-weight, font-family, text-transform, line-height\nExample: h1 { text-align: center; font-weight: bold; }"
    },
    {
      "title": "What are CSS units?",
      "answer": "CSS supports absolute (px, cm) and relative (% , em, rem, vh, vw) units.\nExample: font-size: 16px; or width: 50%;"
    },
    {
      "title": "What is the box model in CSS?",
      "answer": "The box model includes content, padding, border, and margin.\nExample:\ndiv { width: 100px; padding: 10px; border: 2px solid black; margin: 10px; }"
    },
    {
      "title": "What is the difference between padding and margin?",
      "answer": "Padding is space inside the border. Margin is space outside the border.\nExample: padding adds space between content and border, margin adds space between two elements."
    },
    {
      "title": "What is border-radius?",
      "answer": "It rounds the corners of an element.\nExample: border-radius: 10px; or border-radius: 50% for a circle."
    },
    {
      "title": "What are the display types in CSS?",
      "answer": "display: block, inline, inline-block, none\nExample: span { display: inline; } div { display: block; }"
    },
    {
      "title": "What is the difference between visibility: hidden and display: none?",
      "answer": "visibility: hidden hides the element but keeps its space.\ndisplay: none hides the element and removes it from layout."
    },
    {
      "title": "What is RGBA color in CSS?",
      "answer": "RGBA includes red, green, blue and alpha (opacity).\nExample: background-color: rgba(255, 0, 0, 0.5);"
    },
    {
      "title": "What is the position property in CSS?",
      "answer": "The position property defines how an element is placed.\nTypes: static, relative, absolute, fixed, sticky\nExample: position: fixed; top: 0;"
    },
    {
      "title": "What is z-index in CSS?",
      "answer": "z-index controls the stacking order of elements. Higher z-index elements appear above lower ones.\nExample: .box { z-index: 10; position: absolute; }"
    },
    {
      "title": "How to set a background image in CSS?",
      "answer": "Use background-image: url('img.jpg');\nYou can control the size with background-size: cover/contain/auto"
    },
    {
      "title": "What is Flexbox?",
      "answer": "Flexbox is a layout model for distributing space within a container.\nExample: display: flex; justify-content: space-between; align-items: center;"
    },
    {
      "title": "What are Flexbox directions?",
      "answer": "flex-direction: row (default), row-reverse, column, column-reverse\nExample: flex-direction: column;"
    },
    {
      "title": "What is the difference between align-items and align-self?",
      "answer": "align-items aligns all flex items on the cross axis.\nalign-self overrides align-items for a specific item.\nExample: item1 { align-self: flex-start; }"
    },
    {
      "title": "What are media queries?",
      "answer": "Media queries allow CSS to adapt based on screen size.\nExample:\n@media (max-width: 600px) { body { background-color: yellow; } }"
    },
    {
      "title": "What is a transition in CSS?",
      "answer": "Transitions animate changes in CSS properties.\nExample:\ndiv { transition: background-color 2s ease-in; }"
    },
    {
      "title": "What is transform in CSS?",
      "answer": "Transform applies 2D/3D transformations like rotate, scale, translate, skew.\nExample: transform: rotate(45deg);"
    },
    {
      "title": "What is animation in CSS?",
      "answer": "Animations allow property changes over time using keyframes.\nExample:\n@keyframes grow { from { width: 100px; } to { width: 200px; } }\ndiv { animation: grow 2s infinite; }"
    },
    {
      "title": "How to make a circular loader using CSS?",
      "answer": "Step 1: Create a div with a circular shape using border-radius: 50%\nStep 2: Apply animation using keyframes to rotate it\nStep 3: Make it spin continuously using animation-iteration-count: infinite"
    }
  ],

  "js-basics": [
    {
      "title": "What is JavaScript?",
      "answer": "JavaScript is a programming language used to make websites interactive. It can control HTML content, respond to events, and communicate with servers.\nExample: console.log(\"Hello World\");"
    },
    {
      "title": "What are variables in JavaScript?",
      "answer": "Variables are containers for storing data. They are declared using let, const, or var.\nExample: let age = 25;"
    },
    {
      "title": "What is the difference between let, const, and var?",
      "answer": "var: can be re-declared and updated (function scope).\nlet: can be updated but not re-declared (block scope).\nconst: cannot be re-declared or updated (block scope).\nExample: const pi = 3.14;"
    },
    {
      "title": "What are data types in JavaScript?",
      "answer": "JavaScript supports primitive data types like Number, String, Boolean, Null, Undefined, BigInt, and Symbol.\nExample: let name = \"Alice\"; // String"
    },
    {
      "title": "What are operators in JavaScript?",
      "answer": "Operators perform operations on variables and values. Categories: Arithmetic (+, -, *, /), Comparison (==, ===), Logical (&&, ||, !), Assignment (=, +=), etc.\nExample: let sum = 10 + 5;"
    },
    {
      "title": "What is a conditional statement?",
      "answer": "Conditional statements are used to perform different actions based on different conditions.\nExample: if (score > 80) { console.log(\"Excellent\"); }"
    },
    {
      "title": "What is a loop in JavaScript?",
      "answer": "Loops are used to execute a block of code multiple times.\nTypes: for, while, do-while, for-of, for-in\nExample: for (let i = 1; i <= 5; i++) { console.log(i); }"
    },
    {
      "title": "What is a string in JavaScript?",
      "answer": "A string is a sequence of characters. Strings can be manipulated using methods.\nExample: let str = \"Apna College\"; console.log(str.length);"
    },
    {
      "title": "What is an array?",
      "answer": "An array is a collection of items stored in a single variable.\nExample: let fruits = [\"apple\", \"banana\", \"cherry\"];"
    },
    {
      "title": "What are some array methods?",
      "answer": "Common methods:\npush() – add to end,\npop() – remove from end,\nshift(), unshift(), slice(), splice(), map(), filter(), reduce()\nExample: marks.map((m) => m + 5);"
    },
    {
      "title": "What is a function?",
      "answer": "A function is a block of code that performs a specific task.\nExample:\nfunction greet(name) { return \"Hello \" + name; }"
    },
    {
      "title": "What is an arrow function?",
      "answer": "Arrow functions are a shorter syntax for function expressions.\nExample: const add = (a, b) => a + b;"
    },
    {
      "title": "What is DOM in JavaScript?",
      "answer": "DOM (Document Object Model) is a programming interface that allows JavaScript to interact with HTML and CSS.\nExample: document.getElementById(\"myId\").innerText = \"Hello\";"
    },
    {
      "title": "What is event handling?",
      "answer": "Event handling allows you to execute code when events occur (e.g., clicks, keypress).\nExample:\ndocument.querySelector(\"button\").onclick = () => alert(\"Clicked!\");"
    },
    {
      "title": "What are classes and objects in JavaScript?",
      "answer": "A class is a blueprint for creating objects.\nExample:\nclass User { constructor(name) { this.name = name; } }"
    },
    {
      "title": "What is inheritance in JavaScript?",
      "answer": "Inheritance allows one class to inherit properties and methods from another.\nExample:\nclass Admin extends User { constructor(name) { super(name); } }"
    },
    {
      "title": "What is a prototype in JS?",
      "answer": "Every JavaScript object has a prototype. If an object method or property is not found, JS looks into the prototype."
    },
    {
      "title": "What is a callback function?",
      "answer": "A callback is a function passed as an argument to another function to run later.\nExample: setTimeout(() => console.log(\"Done\"), 1000);"
    },
    {
      "title": "What is a promise in JavaScript?",
      "answer": "A Promise represents a value that may be available now, in the future, or never.\nExample:\nlet p = new Promise((resolve, reject) => resolve(\"Done\"));"
    },
    {
      "title": "What is async/await?",
      "answer": "Async/await is used to handle asynchronous code in a cleaner way than using .then().\nExample:\nasync function fetchData() { let res = await fetch(url); }"
    },
    {
      "title": "What is the use of the try-catch block?",
      "answer": "try-catch is used for error handling in JS.\nExample:\ntry { let res = JSON.parse(data); } catch(e) { console.log(\"Error\", e); }"
    },
    {
      "title": "What is IIFE (Immediately Invoked Function Expression)?",
      "answer": "An IIFE is a function that runs as soon as it's defined.\nExample:\n(function() { console.log(\"Run now!\"); })();"
    },
    {
      "title": "What is the window object?",
      "answer": "The window object represents the browser window. It’s the global object in the browser.\nExample: window.alert(\"Hi!\");"
    },
    {
      "title": "What is the difference between == and ===?",
      "answer": "== checks only value, === checks value and type.\nExample: '5' == 5 → true, '5' === 5 → false"
    },
    {
      "title": "What are template literals?",
      "answer": "Template literals allow embedded expressions in strings.\nExample: let msg = `Hello, ${name}`;"
    }
  ],

  "react-basics": [
    {
      title: "What is React?",
      answer: "React is a JavaScript library for creating user interfaces (UI). It allows developers to build reusable UI components that efficiently update and render when data changes."
    },
    {
      title: "What is JSX?",
      answer: "JSX stands for JavaScript XML or JavaScript Extension Syntax. It allows us to write HTML elements directly inside JavaScript. JSX code is compiled by Babel into regular JavaScript."
    },
    {
      title: "How to set up a local React environment?",
      answer: "You can set up a local environment using Create React App or Vite.\nExample using Vite:\n- Run npm create vite@latest\n- Navigate to the project folder\n- Run npm run dev to start the development server."
    },
    {
      title: "How to rewrite the default React App?",
      answer: "You can modify the default code in App.jsx:\njs\nimport './App.css';\nfunction App() {\n  return <h1>Hello world!</h1>;\n}\nexport default App;\n"
    },
    {
      title: "What is a React Component?",
      answer: "A component in React is a reusable and independent piece of code that returns HTML to be rendered on the UI."
    },
    {
      title: "How to create a component in React?",
      answer: "A simple functional component example:\njs\nfunction Title() {\n  return <h1>Hello world!</h1>;\n}\n"
    },
    {
      title: "How to render a component?",
      answer: "You render a component in JSX using:\njs\n<Title />\n\nThis means calling the Title component inside the main App component."
    },
    {
      title: "How to create a component in another file?",
      answer: "To create and use a component in another file:\n1. Export it using export default or export { name }\n2. Import it using import in the main file."
    },
    {
      title: "What is Default Export in React?",
      answer: "Default Export allows exporting a single value from a file:\njs\nexport default Title\nimport Title from './Title.jsx'\n"
    },
    {
      title: "What is Named Export in React?",
      answer: "Named Export allows exporting multiple values:\njs\nexport const Title = () => { ... }\nimport { Title } from './Title.jsx'\n"
    },
    {
      title: "What is JSX Return Rule?",
      answer: "JSX must return a *single root element*. You can wrap multiple elements in a <div> or <> (fragment shorthand) to satisfy this rule."
    },
    {
      title: "What are React Fragments?",
      answer: "React Fragments let you group a list of children without adding extra nodes to the DOM:\njs\n<>\n  <h1>Hello</h1>\n  <p>World</p>\n</>\n"
    },
    {
      title: "How to style components in React?",
      answer: "You can style components using CSS classes. Example:\njs\nimport './product.css'\n<div className='product'>Product</div>\n\nIn CSS:\ncss\n.product {\n  background-color: red\n  margin: 20px\n}\n"
    },
    {
      title: "How to structure components in React?",
      answer: "Structure components by breaking UI into smaller pieces. For example:\njs\nfunction Product() {\n  return (\n    <div className='product'>\n      <p>Product Title</p>\n      <p>Product Description</p>\n    </div>\n  )\n}\n"
    },
    {
      title: "How to write JSX properly?",
      answer: "Use self-closing tags and return elements with proper syntax:\njs\nfunction Title() {\n  return <p>Hello world!</p>\n}\n"
    },
    {
      title: "How to pass props in React?",
      answer: "Props are used to pass data from one component to another.\nExample:\njs\n<Product price='50' />\n\nIn Product Component:\njs\nfunction Product(props) {\n  return <p>Price: {props.price}</p>\n}\n"          
    },
    {
      title: "How to pass arrays as props in React?",
      answer: "You can pass arrays just like any other value:\njs\n<Product features={['fast' 'reliable']} />\n\nIn Product:\njs\nprops.features.map(f => <li>{f}</li>)\n"
    },
    {
      title: "How to conditionally render in React?",
      answer: "Use ternary or if condition:\njs\n{price > 10000 ? <p>Discount: 5%</p> : <p>No Discount</p>}\n"
    },
    {
      title: "How to handle events in React?",
      answer: "Use camelCase and provide function reference:\njs\n<button onClick={showAlert}>Click Me</button>\nfunction showAlert() {\n  alert('Button Clicked')\n}\n"
    },
    {
      title: "How to use 'onMouseOver' event?",
      answer: "You can trigger functions when the mouse hovers:\njs\n<button onMouseOver={hoverHandler}>Hover me</button>\n"
    },
    {
      title: "What is useState in React?",
      answer: "useState is a React Hook used to manage state in functional components.\njs\nconst [count setCount] = useState(0)\n"
    },
    {
      title: "How does useState work?",
      answer: "useState returns an array [currentValue updaterFunction]. The component re-renders when the state changes."
    },
    {
      title: "What is state in React?",
      answer: "State is a built-in object in React that stores dynamic data of a component and determines the component's behavior and rendering."
    },
    {
      title: "What is an event object in React?",
      answer: "The event object is passed automatically to event handler functions. Example:\njs\nfunction handleClick(e) {\n  console.log(e.target)\n}\n"
    },
    {
      title: "How to install React Developer Tools?",
      answer: "Install the React Developer Tools extension from the browser's web store to inspect React component tree and props/state."
    },
    {
      title: "What is Closure in JavaScript?",
      answer: "A closure is a feature where an inner function has access to the outer (enclosing) function’s variables even after the outer function has returned.\n\nExample:\njs\nfunction outer() {\n  let count = 0\n  return function () {\n    count++\n    console.log(count)\n  }\n}\nconst counter = outer()\ncounter() // 1\ncounter() // 2\n"
    },
    {
      title: "What is Re-render and how it works in React?",
      answer: "Re-rendering happens when React updates the DOM to reflect changes in component state or props.\n\nExample:\njs\nfunction App() {\n  const [count setCount] = useState(0)\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n    </div>\n  )\n}\n"
    },
    {
      title: "How to update one element in an array in React state?",
      answer: "Use map() to create a new array with the updated element:\njs\nsetTodos(prev => prev.map(todo => todo.id === id ? {...todo text: 'Updated'} : todo))\n"
    },
    {
      title: "How to update all elements in an array in React state?",
      answer: "Use map() on all elements:\njs\nsetTodos(prev => prev.map(todo => ({...todo text: todo.text.toUpperCase()})))\n"
    },
    {
      title: "What is a callback updater function in React?",
      answer: "A function passed to state updater (setState) which uses the previous state.\n\nExample:\njs\nsetCount(prevCount => prevCount + 1)\n"
    },
    {
      title: "Why use a callback updater function?",
      answer: "Useful when the new state depends on the previous state especially in asynchronous state updates."
    },
    {
      title: "What are the types of Components in React?",
      answer: "React components can be categorized as\n\nLogical Components (Smart)\n- Use state\n- Handle logic\n- Change with state\n\nPresentational Components (Dumb)\n- UI focused\n- Don't use state\n- Purely for rendering"
    },
    {
      title: "What is a Lottery Component example in React?",
      answer: "An example of a component with\n- Props: n = winningSum\n- State: ticket = []\n- Events: buyTicket()"
    },
    {
      title: "What does 'Functions as Props' mean in React?",
      answer: "In JavaScript functions are first-class objects. This means\n- They can be passed as an argument to a function\n- They can be returned from another function\n- They can be assigned to variables"
    },
  ],

  "sql-basics": [
    {
      title: "What is a Database?",
      answer: "A database is a collection of data stored in a format that can be easily accessed, managed, and updated.\nExample: A library catalog or a student records system."
    },
    {
      title: "Why do we need a Database?",
      answer: "Databases help store large amounts of data securely, allow scalability, and make it easy to insert, update, or delete data.\nExample: Banking systems use databases to securely store transaction records."
    },
    {
      title: "What is SQL?",
      answer: "SQL (Structured Query Language) is a programming language used to interact with relational databases.\nExample: Using SQL to write a query like SELECT * FROM students; to get all student records."
    },
    {
      title: "What is MySQL?",
      answer: "MySQL is a popular relational database management system (RDBMS) that uses SQL to manage data.\nExample: Websites like WordPress often use MySQL to store content data."
    },
    {
      title: "How is SQL different from MySQL?",
      answer: "SQL is the language used to manage and query data, while MySQL is the database software that uses SQL."
    },
    {
      title: "What is the difference between SQL and NoSQL?",
      answer: "SQL databases are relational, meaning data is stored in tables with rows and columns. NoSQL databases are non-relational and store data in formats like documents, key-value pairs, or graphs.\nExamples:\n- SQL: MySQL, Oracle, PostgreSQL\n- NoSQL: MongoDB, Cassandra"
    },
    {
      title: "What are some examples of SQL databases?",
      answer: "Examples of SQL databases include MySQL, Oracle, and PostgreSQL."
    },
    {
      title: "What are some examples of NoSQL databases?",
      answer: "Examples of NoSQL databases are MongoDB (document store) and Cassandra (wide-column store)."
    },
    {
      title: "What is a Relational Database?",
      answer: "A relational database stores data in tables (rows and columns) that can be linked together based on relationships.\nExample: A students table related to a courses table through a student_id."
    },
    {
      title: "What is a Non-Relational (NoSQL) Database?",
      answer: "A non-relational (NoSQL) database stores data in non-tabular formats like JSON documents, key-value pairs, or graphs.\nExample: In MongoDB, data is stored as flexible JSON-like documents."
    },
    {
      title: "What is a Table in SQL?",
      answer: "A table is a structure in an SQL database that stores data in rows and columns.\nExample: A Users table with columns like id, name, and email."
    },
    {
      title: "What is a Schema in SQL?",
      answer: "A schema is the design of a table that defines its columns and data types.\nExample: A table Students with schema: id INT, name VARCHAR, age INT."
    },
    {
      title: "What is a Tuple in SQL?",
      answer: "A tuple is a single row in a table.\nExample: A student record {id: 1, name: 'Alex', age: 20} is a tuple."
    },
    {
      title: "Why use SQL databases?",
      answer: "SQL databases ensure structured data, data integrity, and support complex queries and relationships."
    },
    {
      title: "Why use NoSQL databases?",
      answer: "NoSQL databases handle unstructured or semi-structured data, allow high scalability, and work well for big data and real-time applications.\nExample: Storing user activity logs or social media posts."
    },
    {
      title: "How do you create a new database in SQL?",
      answer: "Use the CREATE DATABASE command.\nExample:\n```sql\nCREATE DATABASE college;\n```"
    },
    {
      title: "How do you delete a database in SQL?",
      answer: "Use the DROP DATABASE command.\nExample:\n```sql\nDROP DATABASE college;\n```"
    },
    {
      title: "How do you select a database to use?",
      answer: "Use the USE command.\nExample:\n```sql\nUSE college;\n```"
    },
    {
      title: "How do you create a new table in SQL?",
      answer: "Use the CREATE TABLE command with column names, data types, and constraints.\nExample:\n```sql\nCREATE TABLE Student (\n  rollno INT,\n  name VARCHAR(20),\n  age INT\n);\n```"
    },
    {
      title: "How do you insert data into a table?",
      answer: "Use the INSERT INTO statement.\nExample:\n```sql\nINSERT INTO Student (rollno, name, age) VALUES (101, 'Adam', 18);\n```"
    },
    {
      title: "How do you select all data from a table?",
      answer: "Use the SELECT statement.\nExample:\n```sql\nSELECT * FROM Student;\n```"
    },
    {
      title: "How do you create a database only if it does not already exist?",
      answer: "Use CREATE DATABASE IF NOT EXISTS.\nExample:\n```sql\nCREATE DATABASE IF NOT EXISTS college;\n```"
    },
    {
      title: "How do you drop a database only if it exists?",
      answer: "Use DROP DATABASE IF EXISTS.\nExample:\n```sql\nDROP DATABASE IF EXISTS college;\n```"
    },
    {
      title: "How do you list all available databases?",
      answer: "Use the SHOW DATABASES command.\nExample:\n```sql\nSHOW DATABASES;\n```"
    },
    {
      title: "How do you list all tables in a database?",
      answer: "Use the SHOW TABLES command.\nExample:\n```sql\nSHOW TABLES;\n```"
    },
    {
      title: "What are constraints in SQL?",
      answer: "Constraints define rules for data in a table. Common constraints include:\n- NULL: Allows NULL values\n- UNIQUE: Ensures all values are different\n- DEFAULT: Sets a default value\n- CHECK: Ensures values meet a condition"
    },
    {
      title: "How do you create a table with constraints?",
      answer: "Example to create a user table with constraints:\n```sql\nCREATE TABLE user (\n  id INT,\n  age INT,\n  name VARCHAR(30) NOT NULL,\n  email VARCHAR(50) UNIQUE,\n  followers INT DEFAULT 0,\n  following INT,\n  CONSTRAINT CHECK (age >= 13)\n);\n```"
    },
    {
      title: "How do you create a table with a primary key?",
      answer: "Example to create a post table with a primary key:\n```sql\nCREATE TABLE post (\n  id INT PRIMARY KEY,\n  content VARCHAR(100),\n  user_id INT,\n  FOREIGN KEY (user_id) REFERENCES user(id)\n);\n```"
    },
    {
      title: "What is a PRIMARY KEY?",
      answer: "A PRIMARY KEY makes a column unique and not NULL. It uniquely identifies each row in a table. A table can have only one PRIMARY KEY.\nExample:\n```sql\nid INT PRIMARY KEY\n```"
    },
    {
      title: "What is a FOREIGN KEY?",
      answer: "A FOREIGN KEY creates a link between two tables. It prevents actions that would destroy these links, ensuring referential integrity.\nExample:\n```sql\nFOREIGN KEY (user_id) REFERENCES user(id)\n```"
    },
    {
      title: "What is the WHERE clause in SQL?",
      answer: "The WHERE clause filters rows based on a condition.\n\n**Syntax:**\n```sql\nSELECT col1, col2 FROM table_name\nWHERE condition;\n```\n\n**Example:**\n```sql\nSELECT name, followers\nFROM user\nWHERE followers >= 200;\n```"
    },
    {
      title: "What operators can we use in SQL WHERE clauses?",
      answer: "You can use operators like AND, OR, BETWEEN, IN, and NOT to filter data.\nExamples:\n```sql\nWHERE age BETWEEN 15 AND 17;\nWHERE email IN ('a@x.com', 'b@y.com');\nWHERE age IN (14, 16);\nWHERE age NOT IN (14, 16);\n```"
    },
    {
      title: "What is the LIMIT clause?",
      answer: "The LIMIT clause sets an upper limit on the number of rows returned.\n\n**Syntax:**\n```sql\nSELECT col1, col2 FROM table_name\nLIMIT number;\n```\n\n**Example:**\n```sql\nSELECT * FROM user\nWHERE age > 14\nLIMIT 2;\n```"
    },
    {
      title: "What does ORDER BY do?",
      answer: "ORDER BY sorts rows in ascending or descending order.\n\n**Syntax:**\n```sql\nSELECT col1, col2 FROM table_name\nORDER BY col_name ASC;\n```\n\n**Example:**\n```sql\nORDER BY followers ASC;\n```"
    },
    {
      title: "What are aggregate functions in SQL?",
      answer: "Aggregate functions perform calculations on multiple rows:\n- COUNT(): Counts rows\n- MAX(): Finds maximum value\n- MIN(): Finds minimum value\n- SUM(): Sums up values\n- AVG(): Calculates average\n\n**Examples:**\n```sql\nSELECT MAX(marks) FROM student;\nSELECT COUNT(age) FROM user WHERE age = 14;\n```"
    },
    {
      title: "What is the GROUP BY clause?",
      answer: "The GROUP BY clause groups rows that have the same values into summary rows. It collects data from multiple records and groups the result by one or more columns.\n\n**Syntax:**\n```sql\nSELECT col1, col2\nFROM table_name\nGROUP BY col_name(s);\n```\n\n**Example:**\n```sql\nSELECT age, MAX(followers)\nFROM users\nGROUP BY age;\n```\nThis finds the maximum followers for each age group."
    },
    {
      title: "When do we use GROUP BY?",
      answer: "We usually use GROUP BY with aggregate functions like COUNT(), SUM(), AVG(), MAX(), or MIN(). It organizes data into groups based on one or more columns.\n\n**Example result:**\n```\n| Age | Max(Followers) |\n|-----|----------------|\n| 14  | 400            |\n| 15  | 800            |\n| 16  | 1000           |\n| 17  | 800            |\n```"
    },
    {
      title: "What is the HAVING clause?",
      answer: "The HAVING clause is similar to WHERE but it applies conditions on groups, not individual rows. It filters the grouped results.\n\n**Syntax:**\n```sql\nSELECT col1, col2\nFROM table_name\nGROUP BY col_name(s)\nHAVING condition;\n```\n\n**Example:**\n```sql\nSELECT age, MAX(followers)\nFROM users\nGROUP BY age\nHAVING MAX(followers) > 800;\n```"
    },
    {
      title: "What is the difference between WHERE and HAVING?",
      answer: "WHERE filters rows *before* grouping, HAVING filters groups *after* grouping.\n- **WHERE** → applies to rows\n- **HAVING** → applies to groups\n\nGrouping is necessary for using HAVING."
    },
    {
      title: "What is the general order of SQL clauses?",
      answer: "The general order in an SQL query is:\n```sql\nSELECT column(s)\nFROM table_name\nWHERE condition\nGROUP BY column(s)\nHAVING condition\nORDER BY column(s) ASC;\n```\nThis ensures proper execution: first filter rows, then group, filter groups, and finally sort."
    },
    {
      title: "How do you update existing rows in a table?",
      answer: "Use the UPDATE statement:\n```sql\nUPDATE table_name\nSET col1 = val1, col2 = val2\nWHERE condition;\n```\n**Example:**\n```sql\nUPDATE user SET followers = 600\nWHERE age = 16;\n```\nThis sets followers to 600 for users aged 16."
    },
    {
      title: "How to reset an update?",
      answer: "You can reset updates by setting the columns back:\n```sql\nUPDATE table_name SET col = value;\n```\nAlways use a WHERE clause to prevent updating all rows by mistake!"
    },
    {
      title: "How do you delete rows in SQL?",
      answer: "Use the DELETE statement:\n```sql\nDELETE FROM table_name\nWHERE condition;\n```\n**Example:**\n```sql\nDELETE FROM user WHERE age = 14;\n```\nThis deletes all users with age 14."
    },
    {
      title: "How do you add a column using ALTER?",
      answer: "Use ALTER TABLE to change the schema:\n```sql\nALTER TABLE table_name\nADD COLUMN column_name datatype constraint;\n```\n**Example:**\n```sql\nALTER TABLE student ADD COLUMN marks INT;\n```"
    },
    {
      title: "How do you drop a column?",
      answer: "To drop (delete) a column:\n```sql\nALTER TABLE table_name\nDROP COLUMN column_name;\n```\n**Example:**\n```sql\nALTER TABLE student DROP COLUMN marks;\n```"
    },
    {
      title: "How do you rename a table in SQL?",
      answer: "Use the ALTER TABLE statement with RENAME:\n```sql\nALTER TABLE table_name\nRENAME TO new_table_name;\n```\nThis changes the table name without affecting its data."
    },
    {
      title: "How do you rename a column in SQL?",
      answer: "Use ALTER TABLE with CHANGE COLUMN:\n```sql\nALTER TABLE table_name\nCHANGE COLUMN old_name new_name new_datatype new_constraint;\n```\n**Example:**\n```sql\nALTER TABLE student\nCHANGE COLUMN age student_age INT NOT NULL;\n```"
    },
    {
      title: "How do you modify a column datatype or constraint?",
      answer: "Use ALTER TABLE with MODIFY:\n```sql\nALTER TABLE table_name\nMODIFY column_name new_datatype new_constraint;\n```\n**Example:**\n```sql\nALTER TABLE student\nMODIFY marks FLOAT NOT NULL;\n```"
    },
    {
      title: "What does TRUNCATE do in SQL?",
      answer: "TRUNCATE TABLE deletes all rows in a table but keeps the table structure intact:\n```sql\nTRUNCATE TABLE table_name;\n```\nSo the table stays in the database, but the data is removed."
    },
    {
      title: "What is Faker.js and how is it used?",
      answer: "Faker.js is a library to generate fake data like usernames, emails, and passwords for testing and seeding databases.\n\n**Example:**\n```javascript\nconst { faker } = require('@faker-js/faker');\n\nlet getRandomUser = () => {\n  return {\n    id: faker.datatype.uuid(),\n    username: faker.internet.userName(),\n    email: faker.internet.email(),\n    password: faker.internet.password()\n  };\n};\n\nconsole.log(getRandomUser());\n```"
    },
    {
      title: "How do you connect Node.js with MySQL?",
      answer: "You can use the `mysql` package in Node.js.\n\n**Example:**\n```javascript\nconst mysql = require('mysql');\n\nconst connection = mysql.createConnection({\n  host: 'localhost',\n  user: 'root',\n  password: 'your_password',\n  database: 'your_db_name'\n});\n\nconnection.connect((err) => {\n  if (err) throw err;\n  console.log('Connected to MySQL database');\n});\n\n// To close the connection:\nconnection.end();\n```"
    },
    {
      title: "How can you use SQL from the Command Line Interface (CLI)?",
      answer: "To connect using the MySQL CLI:\n```bash\n/usr/local/mysql/bin/mysql -u root -p\n```\nThis logs you into MySQL. Then you can run commands like:\n```sql\nCREATE SCHEMA mydb;\nSOURCE schema.sql;\n```"
    },
    {
      title: "How does the connection process work in a Node-MySQL setup?",
      answer: "The client (frontend) sends a request to the server (backend/API). The backend uses SQL queries to interact with the database and sends back the result."
    },
    {
      title: "How can you generate multiple random users using Faker?",
      answer: "Use a loop with Faker’s function:\n```javascript\nlet data = [];\nfor (let i = 0; i < 100; i++) {\n  data.push(getRandomUser());\n}\n```"
    },
    {
      title: "How do you display all tables in a MySQL database using Node.js?",
      answer: "Use `SHOW TABLES` with `connection.query`:\n```javascript\nconnection.query('SHOW TABLES', (err, result) => {\n  if (err) throw err;\n  console.log(result);\n  connection.end();\n});\n```"
    },
    {
      title: "What is schema.sql and how can you use it?",
      answer: "`schema.sql` is a SQL file that contains table creation statements. You can execute it in MySQL CLI or through tools like VS Code.\n\n**Example contents of `schema.sql`:**\n```sql\nCREATE TABLE user (\n  id VARCHAR(50) PRIMARY KEY,\n  username VARCHAR(50) NOT NULL,\n  email VARCHAR(50) NOT NULL UNIQUE,\n  password VARCHAR(50) NOT NULL\n);\n```"
    },
    {
      title: "How do you insert multiple users using placeholders?",
      answer: "Use placeholder `?` syntax with `connection.query()` for batch inserts:\n```javascript\nlet q = \"INSERT INTO user (id, username, email, password) VALUES ?\";\nlet users = [\n  [\"12345\", \"danmstro\", \"abc@gmail.com\", \"abcd\"]\n];\nconnection.query(q, [users], (err, result) => {\n  if (err) throw err;\n  console.log(\"Inserted:\", result.affectedRows);\n});\n```"
    }
  ],

  "networking-basics": [
    {
      "title": "What is a computer network?",
      "answer": "A computer network is a group of devices connected to share data and resources. These devices (nodes) are linked using cables or wireless signals."
    },
    {
      "title": "What is a node and a link?",
      "answer": "A node is any device (like a computer or printer) connected to a network. A link is the physical medium like a cable that connects two or more nodes."
    },
    {
      "title": "What is network topology?",
      "answer": "Network topology refers to the physical or logical layout of devices in a network. Common types include Star, Ring, Bus, Mesh, Tree, and Hybrid."
    },
    {
      "title": "What is star topology?",
      "answer": "In star topology, all devices are connected to a central device (like a switch). It's easy to manage but if the central device fails, the whole network goes down."
    },
    {
      "title": "What is ring topology?",
      "answer": "In ring topology, devices are connected in a circular loop. Data travels in one direction. If any device fails, the entire network can be affected."
    },
    {
      "title": "What is bus topology?",
      "answer": "All devices share a single central cable (the bus). It is cheap and simple for small networks but one cable failure breaks the whole network."
    },
    {
      "title": "What is mesh topology?",
      "answer": "In mesh topology, every device is connected to every other device. It is reliable but costly and complex to set up."
    },
    {
      "title": "What is tree topology?",
      "answer": "Tree topology combines characteristics of star and bus topologies. It allows easy expansion and fault isolation in segments."
    },
    {
      "title": "What is hybrid topology?",
      "answer": "Hybrid topology mixes two or more different types of topologies, offering flexibility and efficiency in large networks."
    },
    {
      "title": "What is a PAN (Personal Area Network)?",
      "answer": "A PAN is a small network with a range of up to 10 meters, used for connecting personal devices like phones and laptops."
    },
    {
      "title": "What is a LAN (Local Area Network)?",
      "answer": "A LAN is used in a small geographic area like homes or offices to connect computers and share resources."
    },
    {
      "title": "What is a WAN (Wide Area Network)?",
      "answer": "WAN spans a large geographic area and connects multiple LANs, often using satellite or leased lines (like the internet)."
    },
    {
      "title": "What is VPN?",
      "answer": "VPN (Virtual Private Network) creates a secure connection over the internet, allowing private access to a network remotely."
    },
    {
      "title": "What are the types of VPNs?",
      "answer": "Two main types are Access VPN (for remote users) and Site-to-Site VPN (connects office networks in different locations)."
    },
    {
      "title": "What is the OSI model?",
      "answer": "OSI (Open System Interconnection) is a 7-layer model that standardizes network communication from physical transfer to applications. For example, when you send a message on WhatsApp, it goes through layers like: Application (WhatsApp interface), Transport (breaking message into packets), Network (finding the best route), Data Link (framing data), and Physical (sending signals via Wi-Fi or cable). Each layer handles a specific part of the process to ensure the message reaches the recipient correctly."
    },    
    {
      "title": "What does the Physical Layer do?",
      "answer": "It transfers raw bits over a physical medium (like cables). It’s the lowest layer in the OSI model. For example, when you send an email, the Physical Layer is responsible for converting the data into electrical signals that travel through the cables (or Wi-Fi waves) to reach the destination. It handles the actual transmission of the binary data over physical media like Ethernet cables or wireless radio waves."
    },    
    {
      "title": "What does the Data Link Layer do?",
      "answer": "It ensures error-free transfer of frames between two nodes on the same network. It handles MAC addressing, flow control, and error detection. For example, when your laptop communicates with a Wi-Fi router, the Data Link Layer ensures that the data sent is properly framed, addressed using MAC addresses, and checked for errors before reaching the router."
    },    
    {
      "title": "What is the function of the Network Layer?",
      "answer": "It finds the best path (routing) to deliver packets and assigns logical addresses like IPs. For example, when you access a website, the Network Layer decides how your data packets travel across routers and networks using IP addresses to reach the web server efficiently."
    },    
    {
      "title": "What is the function of the Transport Layer?",
      "answer": "It ensures reliable data delivery using either connection-oriented (TCP) or connectionless (UDP) protocols. For example, when you stream a video on YouTube, UDP is used for faster delivery without waiting for lost packets. But when you send an email, TCP ensures the entire message is delivered accurately and in order."
    },    
    {
      "title": "What does the Application Layer do?",
      "answer": "It provides network services to users and applications (like HTTP, SMTP, DNS). It’s the top layer in both OSI and TCP/IP models. For example, when you browse a website, your web browser uses HTTP at the Application Layer to request and receive web pages from the server."
    },    
    {
      "title": "What is TCP and UDP?",
      "answer": "TCP is reliable and connection-based; good for file transfer. UDP is faster but connectionless; good for streaming and gaming. For example, when you download a file, TCP ensures every packet arrives correctly and in order. But when you're playing an online game or watching a live stream, UDP is used to deliver data quickly, even if some packets get lost."
    },    
    {
      "title": "What is DNS?",
      "answer": "DNS (Domain Name System) converts domain names like google.com into IP addresses. It acts like a phonebook for the internet. For example, when you type 'google.com' into your browser, DNS translates it to an IP address like 142.250.182.206 so your device can locate and connect to Google's server."
    },    
    {
      "title": "What is DHCP?",
      "answer": "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses to devices on a network. For example, when you connect your phone to Wi-Fi, the router’s DHCP server gives your phone an IP address automatically so it can communicate on the network without manual setup."
    },    
    {
      "title": "What is a MAC address?",
      "answer": "MAC (Media Access Control) address is a unique identifier assigned to a device's network interface card (NIC). For example, your laptop's Wi-Fi adapter has its own MAC address, like '00:1A:2B:3C:4D:5E', which is used to identify it on a local network."
    },    
    {
      "title": "What is IP address?",
      "answer": "An IP address is a unique number assigned to each device on a network. IPv4 has 4 blocks like 192.168.1.1. For example, when your phone connects to the internet, it is assigned an IP address like 192.168.0.5, which allows websites and services to know where to send data back to your device."
    },    
    {
      "title": "What is the difference between public and private IPs?",
      "answer": "Private IPs are used within networks and not routable on the internet. Public IPs are used to communicate over the internet. For example, your home Wi-Fi router assigns private IPs like 192.168.0.10 to connected devices, but your internet service provider gives your router a public IP like 203.0.113.5 so it can access websites and online services."
    },    
    {
      "title": "What is ICMP used for?",
      "answer": "ICMP (Internet Control Message Protocol) is used for error reporting and diagnostic tools like 'ping'. For example, when you use the 'ping' command to check if a website is reachable, ICMP sends packets to the destination and measures the response time to help diagnose network issues."
    },    
    {
      "title": "What is a firewall?",
      "answer": "A firewall is a system that monitors and filters incoming and outgoing network traffic based on security rules. For example, your computer’s firewall can block unauthorized access from the internet while allowing safe applications like your browser or email client to communicate freely."
    },    
    {
      "title": "What is subnetting?",
      "answer": "Subnetting divides a network into smaller parts (subnets) to improve routing efficiency and security. For example, in a large organization, subnetting can separate the HR department's devices from the IT department's devices, so internal traffic is more organized and easier to manage."
    },    
    {
      "title": "What is NAT?",
      "answer": "NAT (Network Address Translation) converts private IP addresses to a public IP for internet access and hides internal network structure. For example, when multiple devices in your home (like a phone, laptop, and smart TV) connect to the internet through a single router, NAT allows all of them to share one public IP address while keeping their private IPs hidden from the outside world."
    },    
    {
      "title": "What happens when you type google.com in a browser?",
      "answer": "The browser checks cache, sends a DNS request to get the IP, establishes a TCP connection, sends HTTP request, receives response, and renders the webpage. For example, when you type 'google.com', your computer first looks up its IP using DNS, connects to Google's server using TCP, requests the homepage via HTTP, and finally displays the page once the response is received."
    }
    
  ],

  "oops-principles": [
    {
      "title": "What is Object-Oriented Programming?",
      "answer": "Object-Oriented Programming (OOP) is a programming paradigm that uses classes and objects to design software. It helps in organizing complex code, reusing functionality, and improving maintainability."
    },
    {
      "title": "What is a class in OOP?",
      "answer": "A class is a blueprint or template for creating objects. It defines properties (data members) and behaviors (functions or methods) that its objects will have. For example, a 'Car' class may have properties like 'color' and 'speed', and methods like 'drive()' and 'brake()'."
    },
    {
      "title": "What is an object?",
      "answer": "An object is an instance of a class. It is created in memory and can access the properties and methods defined in the class. For example, 'Car myCar = new Car();' creates an object named 'myCar'."
    },
    {
      "title": "What is inheritance?",
      "answer": "Inheritance allows one class (child) to inherit properties and behaviors from another class (parent). It supports code reuse. For example, a 'Dog' class can inherit from an 'Animal' class."
    },
    {
      "title": "What are types of inheritance?",
      "answer": "Types include:\n1. Single\n2. Multiple\n3. Multilevel\n4. Hierarchical\n5. Hybrid"
    },
    {
      "title": "What is encapsulation?",
      "answer": "Encapsulation means bundling data and functions into a single unit (class) and restricting access to some of the object's components. This is done using access specifiers like private, protected, and public."
    },
    {
      "title": "What is abstraction?",
      "answer": "Abstraction hides unnecessary details and shows only the essential features of an object. For example, a car abstracts complex systems like engines and just provides methods like 'start()' or 'drive()'."
    },
    {
      "title": "What is polymorphism?",
      "answer": "Polymorphism means 'many forms'. It allows one interface to be used for different data types or classes. Types: Compile-time (method overloading) and Runtime (method overriding)."
    },
    {
      "title": "What is method overloading?",
      "answer": "Method overloading is when multiple functions have the same name but different parameters. It happens at compile time. Example: add(int a, int b) and add(int a, int b, int c)."
    },
    {
      "title": "What is method overriding?",
      "answer": "Method overriding occurs when a child class provides a different implementation for a method already defined in its parent class. It is resolved at runtime."
    },
    {
      "title": "What is a constructor?",
      "answer": "A constructor is a special method with the same name as the class. It initializes objects when they are created. Types: Default, Parameterized, Copy Constructor."
    },
    {
      "title": "What is a destructor?",
      "answer": "A destructor is a special method that destroys an object and releases memory. In C++, it starts with a tilde (~) and is automatically called when the object is out of scope."
    },
    {
      "title": "What is the 'this' pointer?",
      "answer": "The 'this' pointer refers to the current object. It is used to differentiate between instance variables and parameters, especially when they have the same name."
    },
    {
      "title": "What is a friend function?",
      "answer": "A friend function is not a member of a class but can access its private and protected members. It is declared using the 'friend' keyword inside the class."
    },
    {
      "title": "What is aggregation?",
      "answer": "Aggregation is a HAS-A relationship where one class contains a reference to another. It helps in code reuse. For example, a 'Library' class HAS-A 'Book' class."
    },
    {
      "title": "What is a virtual function?",
      "answer": "A virtual function is a member function in a base class that can be overridden in a derived class. It enables runtime polymorphism and is declared using the 'virtual' keyword."
    },
    {
      "title": "What is a pure virtual function?",
      "answer": "A pure virtual function has no body in the base class and must be overridden in derived classes. It makes the class abstract. Syntax: virtual void show() = 0;"
    },
    {
      "title": "What is an abstract class?",
      "answer": "An abstract class contains at least one pure virtual function and cannot be instantiated. It provides a base for other classes to build upon."
    },
    {
      "title": "What are access specifiers?",
      "answer": "Access specifiers control access to class members. \n1. Private – accessible only within the class.\n2. Protected – accessible in the class and derived classes.\n3. Public – accessible from anywhere."
    },
    {
      "title": "What is function overloading?",
      "answer": "Function overloading allows multiple functions with the same name but different parameter types or numbers to exist in a class."
    },
    {
      "title": "What is operator overloading?",
      "answer": "Operator overloading allows standard operators (like +, -, *) to work with user-defined data types by redefining their behavior in classes."
    },
    {
      "title": "What is the difference between overloading and overriding?",
      "answer": "Overloading is compile-time polymorphism where functions have the same name but different parameters. Overriding is runtime polymorphism where a derived class provides a specific implementation of a base class function."
    },
    {
      "title": "What is virtual inheritance?",
      "answer": "Virtual inheritance ensures only one instance of a class appears in the inheritance hierarchy when using multiple inheritance."
    },
    {
      "title": "What is a namespace in C++?",
      "answer": "A namespace is used to organize code and avoid naming conflicts. For example, std is a standard namespace containing functions like cout and cin."
    }
  ],

  "dbms-basics": [
    {
      "title": "What is a database?",
      "answer": "A database is a collection of related data that represents some aspect of the real world. It is organized and stored to be easily accessed, managed, and updated."
    },
    {
      "title": "What is DBMS?",
      "answer": "DBMS (Database Management System) is software that allows users to store, retrieve, and manage data in databases, while ensuring data security, consistency, and concurrency."
    },
    {
      "title": "What is an ER diagram?",
      "answer": "An ER (Entity-Relationship) diagram is a visual representation of entities, attributes, and relationships in a database. It helps in designing the structure of a database."
    },
    {
      "title": "What is a strong entity set?",
      "answer": "A strong entity set has enough attributes to uniquely identify all its entities. It has a primary key."
    },
    {
      "title": "What is a weak entity set?",
      "answer": "A weak entity set does not have a primary key but has a partial key called a discriminator, which helps identify entities in combination with another entity."
    },
    {
      "title": "What is a relationship in DBMS?",
      "answer": "A relationship is an association among entities. It can be unary (one entity), binary (two entities), ternary (three), or n-ary (more than three)."
    },
    {
      "title": "What are cardinality constraints?",
      "answer": "Cardinality defines the number of relationships an entity can participate in, such as one-to-one, one-to-many, many-to-one, and many-to-many."
    },
    {
      "title": "What are attributes in DBMS?",
      "answer": "Attributes are properties or characteristics of an entity. They can be simple, composite, multi-valued, derived, or key attributes."
    },
    {
      "title": "What is a functional dependency?",
      "answer": "A functional dependency X → Y means that if two tuples have the same value for X, they must have the same value for Y."
    },
    {
      "title": "What are keys in DBMS?",
      "answer": "Keys are attributes or sets of attributes used to uniquely identify records. Examples: Primary key, Super key, Candidate key, Foreign key, Alternate key, Composite key, Unique key."
    },
    {
      "title": "What is normalization?",
      "answer": "Normalization is the process of organizing data to reduce redundancy and improve data integrity. It uses normal forms like 1NF, 2NF, 3NF, and BCNF."
    },
    {
      "title": "What is First Normal Form (1NF)?",
      "answer": "1NF means each cell in a table contains only atomic (indivisible) values."
    },
    {
      "title": "What is Second Normal Form (2NF)?",
      "answer": "2NF means the table is in 1NF and there are no partial dependencies of non-prime attributes on candidate keys."
    },
    {
      "title": "What is Third Normal Form (3NF)?",
      "answer": "3NF means the table is in 2NF and has no transitive dependencies."
    },
    {
      "title": "What is BCNF?",
      "answer": "Boyce-Codd Normal Form (BCNF) is a stricter version of 3NF where every non-trivial functional dependency has a super key on the left-hand side."
    },
    {
      "title": "What is a transaction in DBMS?",
      "answer": "A transaction is a logical unit of work consisting of a sequence of operations performed on a database."
    },
    {
      "title": "What are ACID properties?",
      "answer": "ACID stands for Atomicity, Consistency, Isolation, and Durability — properties that ensure reliable processing of database transactions."
    },
    {
      "title": "What is serializability?",
      "answer": "Serializability ensures that the result of executing concurrent transactions is the same as if they were executed serially, one after another."
    },
    {
      "title": "What is relational algebra?",
      "answer": "Relational algebra is a procedural query language that works with relations and includes operations like selection, projection, union, set difference, and join."
    },
    {
      "title": "What is SQL?",
      "answer": "SQL (Structured Query Language) is a standard language used to interact with relational databases, including querying, updating, and managing data."
    },
    {
      "title": "What is the difference between DDL and DML?",
      "answer": "DDL (Data Definition Language) deals with schema structure (e.g., CREATE, DROP), while DML (Data Manipulation Language) deals with data itself (e.g., SELECT, INSERT, UPDATE)."
    },
    {
      "title": "What are JOIN operations in SQL?",
      "answer": "JOINs are used to combine rows from two or more tables based on a related column. Types include INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN."
    },
    {
      "title": "What is the purpose of GROUP BY in SQL?",
      "answer": "GROUP BY groups rows with the same values in specified columns to apply aggregate functions like COUNT(), SUM(), AVG()."
    },
    {
      "title": "What is the HAVING clause?",
      "answer": "HAVING filters groups formed by GROUP BY based on aggregate conditions, unlike WHERE which filters individual rows."
    },
    {
      "title": "What is a primary index?",
      "answer": "A primary index is created on the primary key field and provides fast access to data by pointing directly to blocks containing the data."
    },
    {
      "title": "What is a foreign key?",
      "answer": "A foreign key is a field in one table that refers to the primary key of another table, establishing a relationship between the two."
    },
    {
      "title": "What is a composite key?",
      "answer": "A composite key uses two or more attributes to uniquely identify a row in a table when no single attribute is sufficient."
    },
    {
      "title": "What is a B+ Tree?",
      "answer": "A B+ Tree is a self-balanced tree structure used in indexing. Non-leaf nodes contain keys only; all actual data is in the leaf nodes, which are linked for fast access."
    },
    {
      "title": "What is the LIKE operator in SQL?",
      "answer": "LIKE is used to search for a pattern in a column. '%' represents any sequence of characters; '_' represents a single character."
    },
    {
      "title": "What is the BETWEEN operator?",
      "answer": "BETWEEN selects values within a given range, including the boundary values. Example: WHERE Age BETWEEN 18 AND 25."
    }
  ],

  "os-basics": [
    {
      "title": "What is an Operating System?",
      "answer": "An Operating System (OS) is software that acts as an interface between the user and computer hardware. It manages resources like CPU, memory, files, and devices."
    },
    {
      "title": "What are the types of Operating Systems?",
      "answer": "1. Batch OS\n2. Multiprogramming OS\n3. Multitasking OS\n4. Time Sharing OS\n5. Real-Time OS"
    },
    {
      "title": "What is a process?",
      "answer": "A process is a program in execution. It includes the program code, current activity, and a set of resources like memory and files. Each process is tracked using a Process Control Block (PCB)."
    },
    {
      "title": "What is a thread?",
      "answer": "A thread is the smallest unit of CPU execution within a process. Threads share the process's memory and resources but have separate stacks and registers."
    },
    {
      "title": "What is process scheduling?",
      "answer": "Process scheduling is the OS's way of deciding which process to run next based on criteria like arrival time, burst time, and priority. For example, if you're downloading a file while also listening to music, the OS schedules both processes so the music keeps playing smoothly while the download continues in the background."
    },    
    {
      "title": "What are scheduling algorithms?",
      "answer": "Common ones include:\n1. FCFS (First Come First Serve)\n2. SJF (Shortest Job First)\n3. SRTF (Shortest Remaining Time First)\n4. Round Robin\n5. Priority Scheduling\n6. HRRN (Highest Response Ratio Next)\n7. Multilevel Queue\n8. Multilevel Feedback Queue. \n\nFor example, Round Robin scheduling is like a teacher giving each student a fixed amount of time to answer questions in a loop—ensuring no one is left out for too long."
    },    
    {
      "title": "What is a critical section?",
      "answer": "The critical section is a part of the code where shared resources are accessed. Only one process should execute in the critical section at a time to avoid race conditions. For example, if two threads try to update a shared bank account balance at the same time, the code updating the balance should be in a critical section to prevent incorrect results."
    },    
    {
      "title": "What are the conditions for solving the critical section problem?",
      "answer": "1. Mutual Exclusion\n2. Progress\n3. Bounded Waiting\n\nFor example, in an ATM system with multiple users, Mutual Exclusion ensures only one transaction is processed at a time on a specific account, Progress ensures the system doesn’t get stuck when processes want access, and Bounded Waiting ensures that every user eventually gets their turn without indefinite delay."
    },    
    {
      "title": "What is a semaphore?",
      "answer": "A semaphore is a variable used to control access to shared resources. Binary semaphores take values 0 or 1, and counting semaphores can take larger values. For example, if five threads want to access a printer but only two can print at a time, a counting semaphore initialized to 2 will allow only two threads to enter the critical section while others wait."
    },    
    {
      "title": "What is a mutex?",
      "answer": "A mutex (mutual exclusion) is a locking mechanism that allows only one thread to access a resource at a time. It’s used to avoid race conditions. For example, if two threads try to write to the same log file simultaneously, a mutex ensures that one thread locks the file while writing, and the other waits until the lock is released."
    },    
    {
      "title": "What is a deadlock?",
      "answer": "A deadlock is a situation where a set of processes are waiting on each other for resources, and none can proceed. For example, if Process A holds Resource 1 and waits for Resource 2, while Process B holds Resource 2 and waits for Resource 1, both processes are stuck and cannot continue — this is a deadlock."
    },    
    {
      "title": "What are the four necessary conditions for a deadlock?",
      "answer": "1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait\n\nFor example, in a printing system, if one process holds a scanner and waits for a printer, while another holds the printer and waits for the scanner, all four conditions can be met, leading to a deadlock where neither process can proceed."
    },    
    {
      "title": "How to handle deadlocks?",
      "answer": "1. Prevention or avoidance\n2. Detection and recovery\n3. Ignore the problem (used in Windows/Unix)\n\nFor example, in prevention, the system may deny a process from holding one resource while waiting for another. In avoidance, it checks if granting a resource could lead to deadlock. In detection and recovery, the system allows deadlocks to occur but detects and breaks them, while some systems like Windows often just ignore them assuming they are rare."
    },    
    {
      "title": "What is Banker's Algorithm?",
      "answer": "It is a deadlock avoidance method that allocates resources only if the system remains in a safe state after allocation. For example, before allowing a process to use more memory, the Banker's Algorithm checks if enough resources will still be available for all other processes to complete safely, just like a banker only lends money if they’re sure all clients can repay without going bankrupt."
    },    
    {
      "title": "What is memory management?",
      "answer": "It refers to managing a computer's memory effectively among different processes using techniques like swapping, paging, segmentation, and allocation strategies. For example, when you open multiple applications on your computer, the operating system uses memory management to allocate RAM efficiently so that each app runs smoothly without interfering with others."
    },    
    {
      "title": "What is paging?",
      "answer": "Paging divides memory into equal-sized pages and frames. Logical addresses are mapped to physical addresses, reducing external fragmentation. For example, when a program is loaded into memory, it is split into fixed-size pages that can be stored in any available memory frames, making memory usage more efficient and avoiding gaps caused by different process sizes."
    },    
    {
      "title": "What is segmentation?",
      "answer": "Segmentation divides memory into variable-size segments based on logical divisions like functions or data structures. For example, a program may have separate segments for code, data, and stack, allowing each to grow independently and making it easier to manage and protect different parts of the program."
    },    
    {
      "title": "What is a page fault?",
      "answer": "A page fault occurs when a process accesses a page that is not currently in physical memory. For example, if a program tries to read data that has been swapped out to disk, the operating system pauses the program, loads the required page from disk into RAM, and then resumes execution."
    },    
    {
      "title": "What are page replacement algorithms?",
      "answer": "1. FIFO\n2. Optimal\n3. LRU\nThese algorithms decide which page to remove from memory when a new page needs to be loaded. For example, in FIFO (First-In-First-Out), the oldest loaded page is removed first. In LRU (Least Recently Used), the page that hasn’t been used for the longest time is replaced, which helps improve efficiency in many real-world applications."
    },    
    {
      "title": "What is Belady’s Anomaly?",
      "answer": "It is a situation where increasing the number of page frames results in more page faults using FIFO algorithm. For example, in some cases, a program may experience fewer page faults with 3 frames than with 4 frames when using FIFO, which is counterintuitive and highlights inefficiency in the algorithm."
    },    
    {
      "title": "What is disk scheduling?",
      "answer": "It is the method used by the OS to determine the order of servicing disk I/O requests to improve efficiency. For example, if multiple read/write requests are made to different parts of a hard drive, disk scheduling algorithms like SSTF (Shortest Seek Time First) or SCAN are used to decide the optimal order, reducing the total movement of the disk arm and improving performance."
    },    
    {
      "title": "What are disk scheduling algorithms?",
      "answer": "1. FCFS (First Come First Serve)\n2. SSTF (Shortest Seek Time First)\n3. SCAN\n4. CSCAN (Circular SCAN)\n5. LOOK\n6. CLOOK (Circular LOOK)\n\nFor example, SSTF selects the disk I/O request that is closest to the current head position, reducing seek time. SCAN moves the disk arm in one direction servicing requests until it reaches the end, then reverses, like an elevator."
    },    
    {
      "title": "What is thrashing?",
      "answer": "Thrashing occurs when too many pages are swapped in and out of memory, reducing CPU utilization significantly. For example, if multiple programs are running and each frequently accesses data not currently in RAM, the system spends more time swapping pages than executing processes, causing performance to drop drastically."
    },    
    {
      "title": "What is virtual memory?",
      "answer": "Virtual memory is a technique that enables processes to execute even when they don’t fit entirely in physical memory, using disk as extension. For example, if your computer runs out of RAM while opening a large application, it moves some inactive data to disk (swap space) to free up RAM, allowing the program to continue running smoothly."
    },    
    {
      "title": "What is fragmentation?",
      "answer": "Fragmentation is inefficient use of memory.\n- Internal: Wasted space inside allocated memory.\n- External: Wasted space between allocated blocks.\n\nFor example, if a program is allocated 100 KB but only uses 70 KB, the remaining 30 KB is internal fragmentation. If several small free memory blocks exist between allocated areas but none are large enough for a new process, that’s external fragmentation."
    },    
    {
      "title": "What is spooling?",
      "answer": "Spooling is a process of storing data temporarily for devices like printers. It queues the jobs to manage access efficiently. For example, when you print multiple documents, the OS stores them in a spool (buffer) and sends them one by one to the printer, allowing you to continue working while printing happens in the background."
    },    
    {
      "title": "What is starvation?",
      "answer": "Starvation happens when a process waits indefinitely for a resource because other higher priority processes are continuously allocated those resources. For example, in priority scheduling, if low-priority processes keep getting skipped because high-priority ones keep arriving, the low-priority process may never get CPU time, leading to starvation."
    },    
    {
      "title": "What is aging?",
      "answer": "Aging is a technique used to prevent starvation by gradually increasing the priority of waiting processes over time. For example, if a low-priority process has been waiting in the queue for a long time, the system increases its priority so it eventually gets CPU time, ensuring fairness in scheduling."
    },    
    {
      "title": "What is a monolithic kernel?",
      "answer": "A monolithic kernel contains all the essential services in a single large block of code running in a single address space. For example, operating systems like Linux use a monolithic kernel where device drivers, file system management, and memory management all run in kernel mode, offering high performance but potentially lower modularity."
    },    
    {
      "title": "What is a microkernel?",
      "answer": "A microkernel contains only the essential services and runs most services in user space, improving modularity and security. For example, in microkernel-based systems like Minix or QNX, only core functions like communication and scheduling run in kernel mode, while device drivers and file systems run in user space, making the system more stable and easier to maintain."
    },    
    {
      "title": "What is re-entrancy?",
      "answer": "Re-entrancy allows multiple users to share a single copy of a program at the same time without interfering with each other. For example, a re-entrant function in a library can be safely called by multiple threads simultaneously without corrupting data or causing errors."
    },    
    {
      "title": "What is RAID?",
      "answer": "RAID stands for Redundant Array of Independent Disks. It combines multiple disks to increase performance and provide fault tolerance. For example, RAID 1 mirrors data across two disks, so if one disk fails, the data is still available on the other."
    },    
    {
      "title": "What is logical vs physical address?",
      "answer": "Logical address is generated by the CPU. Physical address is the actual location in memory where data is stored. For example, when a program runs, it uses logical addresses, which are translated by the memory management unit (MMU) into physical addresses in RAM."
    },    
    {
      "title": "What are the advantages of multithreading?",
      "answer": "1. Better responsiveness\n2. Resource sharing\n3. Lower overhead\n4. Efficient utilization of multiple CPUs\n\nFor example, in a web browser, multithreading allows loading images, rendering text, and responding to user input simultaneously, resulting in a smoother user experience."
    }
    
  ],

  "mongodb": [
    {
      title: "What is mongosh in MongoDB?",
      answer: "mongosh is the MongoDB shell used to interact with MongoDB from the command line.\nExample: Run mongosh to start the shell."
    },
    {
      title: "How to create or switch to a database in MongoDB?",
      answer: "Use the use command followed by the database name.\nExample: use college\nIf the database doesn't exist it will be created when data is inserted."
    },
    {
      title: "What is BSON in MongoDB?",
      answer: "BSON (Binary JSON) is the format MongoDB uses internally to store data. It is binary-encoded and supports more data types than regular JSON."
    },
    {
      title: "Difference between JSON and BSON?",
      answer: "JSON is text-based and human-readable.\nBSON is binary-encoded more efficient for storage but not space efficient due to added metadata."
    },
    {
      "title": "What is a Collection in MongoDB?",
      "answer": "A collection is a group of MongoDB documents, similar to a table in relational databases.\nEach document is a record (like a row), and documents in a collection can have different structures.\n\nExample:\nSuppose you have a database `school`. You can create a collection `students` where each document represents a student:\n\n{\n  \"name\": \"Alice\",\n  \"age\": 15,\n  \"grade\": \"10th\"\n}\n\n{\n  \"name\": \"Bob\",\n  \"age\": 16,\n  \"grade\": \"10th\",\n  \"hobbies\": [\"football\", \"chess\"]\n}\n\nHere, both documents are part of the `students` collection, even though their fields are slightly different."
    },
        
    {
      title: "How does MongoDB store data?",
      answer: "MongoDB stores data in the form of documents (like JSON objects) inside collections and collections belong to a database.\nStructure: Database → Collections → Documents"
    },
    {
      "title": "How to insert a single document into a collection?",
      "answer": "Use the `insertOne()` method on a collection to add a single document.\n\nSyntax:\ndb.<collection>.insertOne({ field1: value1, field2: value2, ... })\n\nExample:\ndb.Student.insertOne({ name: 'Adam', marks: 75 })\n\nThis inserts one document with `name` and `marks` fields into the `Student` collection."
    },    
    {
      title: "How to display all documents in a collection?",
      answer: "Use the find() method.\nExample: db.Student.find()"
    },
    {
      title: "What happens if a collection doesn't exist in MongoDB?",
      answer: "If a collection does not exist MongoDB creates it automatically when you first insert data into it."
    },
    {
      "title": "What is insertMany in MongoDB?",
      "answer": "`insertMany()` is a method in MongoDB used to insert multiple documents into a collection in a single operation. It is more efficient than calling `insertOne()` repeatedly, especially for large data sets.\n\nEach document in the array can have different fields, and MongoDB will automatically assign a unique `_id` to each document if not provided.\n\n**Syntax:**\ndb.<collection>.insertMany([ {doc1}, {doc2}, ... ])\n\n**Example:**\ndb.student.insertMany([\n  { name: 'A', age: 14 },\n  { name: 'B', age: 15 },\n  { name: 'C', age: 16 }\n])\n\n**Explanation:**\n- This command adds 3 documents to the `student` collection.\n- Each document represents a student with `name` and `age` fields.\n- If any document fails to insert (e.g., due to duplicate `_id`), the operation can be configured to either continue or stop.\n\n**Advantages:**\n- Faster insertion when dealing with bulk data.\n- Reduces number of database calls, improving performance.\n\n**Note:**\n- You can also pass an optional second argument to control behavior like `ordered: false` to allow continuing even if some inserts fail."
    },    
    {
      title: "How to find all documents in a collection?",
      answer: "Use find() with no arguments to return all documents.\nExample:\ndb.collection.find()"
    },
    {
      "title": "How to run specific queries in MongoDB?",
      "answer": "In MongoDB, you can run specific queries using key-value filters to find matching documents in a collection.\n\n**Common Methods:**\n- `find()` returns all documents that match the filter.\n- `findOne()` returns the first matching document only.\n\n**Syntax:**\ndb.<collection>.find({ key: value })\ndb.<collection>.findOne({ key: value })\n\n**Examples:**\n1. Find all students named 'John':\ndb.students.find({ name: 'John' })\n\n2. Find one student with marks greater than 80:\ndb.students.findOne({ marks: { $gt: 80 } })\n\n**Notes:**\n- You can use query operators like `$gt`, `$lt`, `$in`, `$and`, etc., for advanced filtering.\n- The result of `find()` is a cursor, which you can iterate over to access individual documents."
    },    
    {
      "title": "How to use query operators in MongoDB?",
      "answer": "MongoDB provides powerful query operators to perform complex searches.\nSome commonly used operators include:\n- `$gt`: Greater than\n- `$lt`: Less than\n- `$in`: Matches any value in an array\n- `$or`: Matches if any of the conditions are true\n\n**Examples:**\n1. Find students with marks greater than 75:\ndb.student.find({ marks: { $gt: 75 } })\n\n2. Find students from either Delhi or Mumbai:\ndb.student.find({ city: { $in: ['Delhi', 'Mumbai'] } })\n\n3. Find students with marks greater than 75 OR from Chandigarh:\ndb.student.find({ $or: [ { marks: { $gt: 75 } }, { city: 'Chd' } ] })\n\n**Note:**\n- All operators start with a `$` symbol.\n- These can be nested inside queries for more advanced filtering."
    },    
    {
      "title": "What is updateOne in MongoDB?",
      "answer": "`updateOne()` is a method in MongoDB used to update the **first** document that matches a specified filter.\nIt takes two main arguments:\n1. The filter to match the document.\n2. The update operation (e.g., `$set`, `$inc`).\n\n**Syntax:**\ndb.<collection>.updateOne(filter, update)\n\n**Example:**\ndb.student.updateOne(\n  { name: 'Adam' },\n  { $set: { marks: 99 } }\n)\n\n**Explanation:**\n- This command finds the first student document where `name` is 'Adam' and updates the `marks` field to 99.\n- Only the first matching document is updated, even if more exist.\n\n**Note:**\n- Always use update operators like `$set` to avoid replacing the entire document unintentionally."
    },    
    {
      "title": "What is updateMany in MongoDB?",
      "answer": "`updateMany()` is used to update **all** documents in a collection that match a given filter.\nIt allows you to modify multiple documents at once using update operators like `$set`, `$inc`, etc.\n\n**Syntax:**\ndb.<collection>.updateMany(filter, update)\n\n**Example:**\ndb.student.updateMany(\n  { city: 'Delhi' },\n  { $set: { city: 'N.D.' } }\n)\n\n**Explanation:**\n- This command finds all student documents where `city` is 'Delhi' and updates the value of `city` to 'N.D.'.\n- Unlike `updateOne()`, this updates **all matching documents**, not just the first one.\n\n**Note:**\n- It's important to use update operators like `$set` to avoid replacing entire documents accidentally."
    },    
    {
      "title": "What is replaceOne in MongoDB?",
      "answer": "`replaceOne()` replaces the **entire document** that matches a given filter with a **new document**.\nUnlike `updateOne()`, it does not use update operators like `$set` — the whole document is replaced.\n\n**Syntax:**\ndb.<collection>.replaceOne(filter, replacement)\n\n**Example:**\ndb.student.replaceOne(\n  { name: 'Bob' },\n  { name: 'Shraddha', marks: 94, state: 'Haryana' }\n)\n\n**Explanation:**\n- This command finds the first document where `name` is 'Bob' and replaces it completely with a new document.\n- If the original document had other fields (e.g., `age`, `city`), they will be lost unless included in the replacement.\n\n**Note:**\n- Use `replaceOne()` only when you want to fully overwrite an existing document."
    },    
    {
      "title": "What does replaceOne() do if multiple documents match?",
      "answer": "`replaceOne()` replaces **only the first** document that matches the given filter, even if multiple documents satisfy the condition.\n\n**Explanation:**\n- It does not update all matching documents — only the first one it finds.\n- This behavior is similar to `updateOne()`, which also targets only the first match.\n\n**Example:**\nIf multiple documents have `name: 'Bob'`, the following command:\ndb.student.replaceOne(\n  { name: 'Bob' },\n  { name: 'Shraddha', marks: 94 }\n)\nwill only replace the first matching document with the new one."
    },    
    {
      "title": "What is nesting in MongoDB documents?",
      "answer": "Nesting in MongoDB refers to storing documents or objects **within** other documents as values. This allows you to represent complex and hierarchical data structures.\n\n**Example:**\n{\n  _id: ObjectId('...'),\n  name: 'Farah',\n  performance: {\n    marks: 88,\n    grade: 'A'\n  }\n}\n\n**Explanation:**\n- In this example, the `performance` field is itself an embedded document containing `marks` and `grade`.\n- Nesting is useful for logically grouping related data together (like address, performance, contact details, etc.).\n\n**Note:**\n- You can query nested fields using dot notation. Example:\n  `db.student.find({ 'performance.grade': 'A' })`"
    },    
    {
      "title": "How to query nested fields in MongoDB?",
      "answer": "To query nested fields in MongoDB, use **dot notation**, where you specify the path to the nested field using a dot (`.`) between levels.\n\n**Syntax:**\ndb.<collection>.find({ 'parentField.childField': value })\n\n**Example:**\ndb.student.findOne({ 'performance.marks': 88 })\n\n**Explanation:**\n- If a document has a nested field like `performance: { marks: 88 }`, you can access `marks` using `'performance.marks'`.\n- This allows you to filter documents based on values deep inside nested objects.\n\n**Note:**\n- Dot notation also works with deeper nesting like `'a.b.c'` and with array elements as well."
    },
        
    {
      "title": "How to delete a single document from a collection?",
      "answer": "Use the `deleteOne()` method with a filter to remove the **first** matching document from a MongoDB collection.\n\n**Syntax:**\ndb.<collection>.deleteOne({ key: value })\n\n**Examples:**\n1. Delete one student from Haryana:\ndb.student.deleteOne({ state: 'Haryana' })\n\n2. Delete one document where `name` is 'John':\ndb.student.deleteOne({ name: 'John' })\n\n**Explanation:**\n- The method deletes **only the first document** that matches the filter criteria.\n- If no documents match, nothing is deleted.\n\n**Note:**\n- Be careful with the filter to avoid unintentionally removing the wrong document."
    },    
    {
      "title": "How to delete multiple documents from a collection?",
      "answer": "Use the `deleteMany()` method with a filter to delete **all documents** that match the given condition.\n\n**Syntax:**\ndb.<collection>.deleteMany({ key: value })\n\n**Example:**\ndb.student.deleteMany({ marks: { $lt: 75 } })\n\n**Explanation:**\n- This command deletes all student documents where `marks` are less than 75.\n- Unlike `deleteOne()`, `deleteMany()` removes **every matching document**.\n\n**Note:**\n- Always double-check your filter before running `deleteMany()` to avoid accidentally deleting large amounts of data."
    },    
    {
      title: "How to delete all documents in a collection?",
      answer: "Use deleteMany({}) with an empty filter.\nExample:\ndb.student.deleteMany({})"
    },
    {
      title: "How to delete an entire database in MongoDB?",
      answer: "Use dropDatabase() to remove the current database completely.\nExample:\ndb.dropDatabase()"
    },
    {
      title: "What is Mongoose?",
      answer: "Mongoose is an ODM (Object Data Modeling) library that helps create a connection between MongoDB and the Node.js runtime environment. It simplifies interaction with MongoDB using schema and models."
    },
    {
      "title": "What is a Schema in Mongoose?",
      "answer": "A Schema in Mongoose defines the structure or blueprint of the documents within a MongoDB collection.\nIt specifies the **field names**, **data types**, and **validation rules** for the documents.\n\n**Purpose:**\n- Ensures consistency in the shape of documents.\n- Adds features like default values, required fields, validation, etc.\n\n**Example:**\nconst mongoose = require('mongoose');\n\nconst studentSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  age: Number,\n  enrolled: { type: Boolean, default: false }\n});\n\n**Explanation:**\n- This schema defines a `Student` document with `name`, `age`, and `enrolled` fields.\n- `name` must be a string and is required.\n- `enrolled` is a boolean with a default value of `false`.\n\nSchemas are used to create Mongoose models, which interact with the MongoDB collection."
    },    
    {
      "title": "What is a Model in Mongoose?",
      "answer": "A **Model** in Mongoose is a class created from a schema. It represents a specific MongoDB collection and provides an interface to interact with the data.\n\n**Purpose:**\n- Used to create, read, update, and delete documents (CRUD operations).\n- Connects your schema definition to an actual MongoDB collection.\n\n**Example:**\nconst mongoose = require('mongoose');\n\nconst studentSchema = new mongoose.Schema({\n  name: String,\n  age: Number\n});\n\nconst Student = mongoose.model('Student', studentSchema);\n\n**Explanation:**\n- `Student` is a model based on `studentSchema`.\n- It will be linked to the `students` collection in MongoDB (Mongoose auto-pluralizes the name).\n- You can now do operations like:\n  - `Student.find()` to read data\n  - `Student.create()` to insert data\n  - `Student.updateOne()` to update\n  - `Student.deleteOne()` to delete\n\n**Note:**\n- Models are the key to using Mongoose effectively for database interaction."
    },    
    {
      title: "What is operation buffering in Mongoose?",
      answer: "Mongoose allows you to start using your models even before a MongoDB connection is fully established. This is known as operation buffering."
    },
    {
      "title": "Is Mongoose's find() a promise?",
      "answer": "Mongoose queries like `find()` are not actual promises, but they are **thenable**, meaning they behave like promises and support `.then()`, `.catch()`, and `async/await`.\n\n**Example:**\nStudent.find({ age: { $gt: 15 } })\n  .then(data => console.log(data))\n  .catch(err => console.error(err));\n\n**Explanation:**\n- Although not native promises, Mongoose query objects implement `.then()` so you can treat them as promises in most use cases.\n- You can also use `await` for cleaner syntax in async functions:\n\n```js\nconst data = await Student.find({ age: { $gt: 15 } });\n```\n\n**Note:**\n- Internally, Mongoose queries are not full ES6 promises to allow chaining and extra query features, but they are compatible with promise-based syntax."
    },    
    {
      "title": "What are commonly used find operations in Mongoose?",
      "answer": "Mongoose provides several methods to retrieve documents from a MongoDB collection. The most commonly used are:\n\n1. **Model.find(filter)**\n   - Returns all documents that match the filter.\n   - Returns a query object (can use `.then()` or `await`).\n   - Example: `Student.find({ age: { $gt: 15 } })`\n\n2. **Model.findOne(filter)**\n   - Returns the **first** document that matches the filter.\n   - Returns `null` if no match is found.\n   - Example: `Student.findOne({ name: 'Alice' })`\n\n3. **Model.findById(id)**\n   - Finds a document by its `_id` value.\n   - Useful when you already know the unique identifier.\n   - Example: `Student.findById('60f1a2b9c8a4a0b1e4d5c6f7')`\n\n**Note:** All of these methods return thenable query objects, so they support both `.then()` chaining and `async/await` syntax."
    },    
    {
      "title": "What are update operations in Mongoose?",
      "answer": "Mongoose provides several methods to update documents in a collection:\n\n1. **Model.updateOne(filter, update)**\n   - Updates the **first** document that matches the filter.\n   - Does **not** return the updated document by default.\n   - Example: `Student.updateOne({ name: 'Alice' }, { $set: { marks: 90 } })`\n\n2. **Model.updateMany(filter, update)**\n   - Updates **all** documents that match the filter.\n   - Does not return updated documents.\n   - Example: `Student.updateMany({ class: '10A' }, { $set: { promoted: true } })`\n\n3. **Model.findOneAndUpdate(filter, update, options)**\n   - Finds and updates the **first** matching document.\n   - Returns the **original** document by default, unless `{ new: true }` is specified.\n   - Example: `Student.findOneAndUpdate({ name: 'Bob' }, { $inc: { marks: 5 } }, { new: true })`\n\n4. **Model.findByIdAndUpdate(id, update, options)**\n   - Finds a document by its `_id` and updates it.\n   - Returns the updated document if `{ new: true }` is passed.\n   - Example: `Student.findByIdAndUpdate(id, { $set: { grade: 'A+' } }, { new: true })`\n\n**Note:** Always use update operators like `$set`, `$inc`, etc., when modifying fields to avoid overwriting entire documents unintentionally."
    },    
    {
      "title": "How to delete a single document using Mongoose?",
      "answer": "Use `Model.deleteOne()` to remove the **first document** that matches the given filter from the MongoDB collection.\n\n**Syntax:**\nModel.deleteOne(filter)\n\n**Example:**\nStudent.deleteOne({ name: 'Adam' })\n\n**Explanation:**\n- This command deletes the first student document where the `name` is 'Adam'.\n- If no documents match the filter, nothing is deleted.\n\n**Note:**\n- `deleteOne()` returns a result object that includes a `deletedCount` field indicating how many documents were removed (0 or 1).\n- Use this method when you want to ensure that only **one** document is deleted, even if multiple match."
    },    
    {
      "title": "How to delete multiple documents in Mongoose?",
      "answer": "Use `Model.deleteMany()` to remove **all documents** that match the specified filter from a MongoDB collection.\n\n**Syntax:**\nModel.deleteMany(filter)\n\n**Example:**\nStudent.deleteMany({ city: 'Delhi' })\n\n**Explanation:**\n- This command deletes all student documents where the `city` field is 'Delhi'.\n- If no documents match, nothing is deleted.\n\n**Note:**\n- `deleteMany()` returns a result object that includes a `deletedCount` indicating how many documents were removed.\n- Always double-check your filter when using this method to avoid unintended mass deletion."
    },    
    {
      "title": "What does findByIdAndDelete() do?",
      "answer": "`Model.findByIdAndDelete(id)` finds a document in the MongoDB collection by its `_id` and deletes it.\n\n**Syntax:**\nModel.findByIdAndDelete(id)\n\n**Example:**\nStudent.findByIdAndDelete('60f7a2b9e3d5c91234abcd12')\n\n**Explanation:**\n- This method looks for a document with the specified `_id` and removes it from the collection.\n- It returns the **deleted document** if found, or `null` if no document matches the given ID.\n\n**Note:**\n- This is a convenient method when you want to delete a document and also get its data in response.\n- You can also pass an optional callback or use `await` for asynchronous handling."
    },    
    {
      "title": "What is the use of findOneAndDelete() in Mongoose?",
      "answer": "`Model.findOneAndDelete(filter)` is used to find the **first document** that matches the given filter and delete it from the collection.\n\n**Syntax:**\nModel.findOneAndDelete(filter)\n\n**Example:**\nStudent.findOneAndDelete({ name: 'Aman' })\n\n**Explanation:**\n- This method searches for the first document where `name` is 'Aman' and deletes it.\n- It returns the **deleted document** if found, or `null` if no match is found.\n\n**Use Cases:**\n- When you want to delete a document **and** retrieve its content at the same time.\n- Useful for cleanup operations or soft delete patterns where you want to log or process the deleted data.\n\n**Note:**\n- If multiple documents match, only the **first** one (based on the collection's natural order) will be deleted."
    },    
    {
      "title": "Does deleteOne() return anything?",
      "answer": "Yes, `deleteOne()` returns a result object that contains information about the deletion.\n\n**Returned Object Example:**\n{\n  acknowledged: true,\n  deletedCount: 1\n}\n\n**Explanation:**\n- `acknowledged`: Indicates whether the operation was successfully acknowledged by the database.\n- `deletedCount`: Shows how many documents were actually deleted (either `0` or `1`).\n\n**Example:**\nconst result = await Student.deleteOne({ name: 'Aman' });\nconsole.log(result.deletedCount); // Outputs 1 if a document was deleted\n\n**Note:**\n- If no documents match the filter, `deletedCount` will be `0`."
    },    
    {
      "title": "What is validation in Mongoose?",
      "answer": "Validation in Mongoose ensures that the data being inserted or updated in a MongoDB collection **follows the rules defined in the schema**.\n\n**Purpose:**\n- Prevents invalid or inconsistent data from being saved to the database.\n- Enforces data integrity and correctness at the application level.\n\n**Example:**\nconst studentSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  age: { type: Number, min: 5, max: 100 },\n  email: { type: String, match: /.+\\@.+\\..+/ }\n});\n\n**Explanation:**\n- `required: true` ensures `name` must be provided.\n- `min` and `max` restrict the range of age.\n- `match` uses a regex to validate email format.\n\n**Note:**\n- Mongoose runs validation automatically before saving a document.\n- You can also trigger validation manually using `.validate()`.\n- Custom validation functions can also be added for more complex logic."
    },    
    {
      "title": "How to define required fields in Mongoose schema?",
      "answer": "To make a field required in Mongoose, use the property `required: true` in the schema definition.\n\n**Syntax:**\n{ fieldName: { type: DataType, required: true } }\n\n**Example:**\nconst productSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  price: { type: Number }\n});\n\n**Explanation:**\n- In this schema, `name` is a required field, so a document **must** include it.\n- `price` is optional, so documents may or may not have it.\n\n**Note:**\n- You can also provide a custom error message:\n  `{ required: [true, 'Product name is required'] }`\n- Required fields are validated before saving documents to the database."
    },    
    {
      "title": "What is Middleware in Express?",
      "answer": "Middleware in Express is a function that executes during the **request-response cycle**. It has access to the `request` and `response` objects, and can either:\n- Modify them,\n- End the request-response cycle, or\n- Call the `next()` function to pass control to the next middleware in the stack.\n\n**Syntax:**\n```js\napp.use((req, res, next) => {\n  console.log('Middleware running');\n  next();\n});\n```\n\n**Types of Middleware:**\n- Application-level middleware\n- Router-level middleware\n- Error-handling middleware\n- Built-in middleware (like `express.json()`)\n- Third-party middleware (like `morgan`, `cors`)\n\n**Example:**\n```js\napp.use((req, res, next) => {\n  req.requestTime = Date.now();\n  next();\n});\n```\n\n**Explanation:**\n- This middleware adds a `requestTime` property to every incoming request.\n\n**Note:**\n- Middleware is powerful for tasks like logging, authentication, validation, error handling, and more."
    },    
    {
      "title": "Common Middleware Functions in Express",
      "answer": "Express supports various middleware functions that perform tasks during the request-response cycle. Some of the most commonly used middleware are:\n\n1. **express.static**\n   - Serves static files (HTML, CSS, JS, images, etc.).\n   - Example: `app.use(express.static('public'))`\n\n2. **express.json** *(built-in)*\n   - Parses incoming requests with JSON payloads.\n   - Example: `app.use(express.json())`\n\n3. **express.urlencoded** *(built-in)*\n   - Parses incoming requests with URL-encoded data (typically from forms).\n   - Example: `app.use(express.urlencoded({ extended: true }))`\n\n4. **body-parser** *(external)*\n   - Older middleware used to parse JSON and URL-encoded data.\n   - Now mostly replaced by built-in `express.json()` and `express.urlencoded()`.\n\n5. **method-override**\n   - Allows use of HTTP verbs like PUT or DELETE in places (like HTML forms) that only support GET/POST.\n   - Example: `app.use(methodOverride('_method'))`\n\n6. **morgan**\n   - Logs HTTP requests in the console (useful for debugging).\n   - Example: `app.use(morgan('dev'))`\n\n**Note:** Middleware must be registered using `app.use()` or directly on routes."
    },    
    {
      "title": "What does Middleware do?",
      "answer": "Middleware in Express plays a crucial role in handling requests and responses. It can:\n\n1. **Execute any code**\n   - Example: Logging, authentication checks, setting headers, etc.\n\n2. **Modify the request (`req`) and response (`res`) objects**\n   - Example: Adding a `user` property to `req` after decoding a token.\n\n3. **End the request-response cycle**\n   - Example: Sending a response directly from the middleware: `res.send('Access Denied')`\n\n4. **Call the next middleware in the stack using `next()`**\n   - This passes control to the next matching route or middleware.\n\n**Example:**\n```js\napp.use((req, res, next) => {\n  console.log('Request URL:', req.url);\n  next();\n});\n```\n\n**Note:**\n- Middleware functions run in the order they are defined.\n- They are essential for building scalable and maintainable Express apps."
    },    
    {
      "title": "What is the 'next' middleware function in Express?",
      "answer": "The `next` function in Express is a callback provided to middleware functions that, when called, passes control to the **next middleware** in the stack.\n\n**Purpose:**\n- It ensures that the request continues through the middleware chain.\n- If `next()` is **not** called and no response is sent, the request will hang and eventually time out.\n\n**Syntax:**\n```js\napp.use((req, res, next) => {\n  console.log('This is a middleware');\n  next(); // Passes control to the next middleware\n});\n```\n\n**Example Use Case:**\n- Logging, authentication, adding properties to `req`, etc., before reaching the route handler.\n\n**Note:**\n- You can also pass an error to `next(err)` to trigger the error-handling middleware."
    },    
    {
      "title": "What is an example of writing a middleware?",
      "answer": "A middleware function in Express is written with three parameters: `req`, `res`, and `next`. It can perform actions before passing control to the next middleware or route handler.\n\n**Example:**\n```js\napp.use((req, res, next) => {\n  console.log('Middleware executed');\n  next(); // Pass control to the next middleware or route\n});\n```\n\n**Explanation:**\n- This middleware logs a message every time a request is received.\n- `next()` is important to continue the request-response cycle.\n\n**Note:**\n- Middleware functions can be global (using `app.use`) or route-specific."
    },    
    {
      "title": "What is a default error handler in Express?",
      "answer": "Express provides a **default error-handling middleware** that is automatically triggered when `next(err)` is called in any middleware or route.\n\n**How it works:**\n- If any middleware or route calls `next(error)`, Express skips all remaining middleware and routes.\n- It invokes the built-in error handler, which sends a response with **status code 500** (Internal Server Error) and the error message (in development mode).\n\n**Example:**\n```js\napp.use((req, res, next) => {\n  const err = new Error('Something went wrong');\n  next(err);\n});\n```\n\n**Default behavior:**\n- In production, the default error handler hides the stack trace.\n- In development, it includes stack trace in the response.\n\n**Note:**\n- You can define your **custom error handler** by creating middleware with 4 parameters: `(err, req, res, next)`."
    },    
    {
      "title": "How to handle errors in Express using middleware?",
      "answer": "To handle errors in Express, you can define a special **error-handling middleware** function with **four parameters**: `(err, req, res, next)`.\n\n**Syntax:**\n```js\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).send('Something broke!');\n});\n```\n\n**Explanation:**\n- This middleware is triggered whenever `next(err)` is called in the app.\n- `err` is the error object, `req` and `res` are the request and response objects, and `next` is used to pass control (if needed).\n\n**Usage Example:**\n```js\napp.get('/', (req, res) => {\n  throw new Error('Unexpected error');\n});\n\n// Error-handling middleware (must come last)\napp.use((err, req, res, next) => {\n  res.status(500).send('Internal Server Error');\n});\n```\n\n**Note:**\n- Error-handling middleware should always be added **after** all routes and regular middleware.\n- You can customize responses for different types of errors (validation, auth, etc.)."
    },    
    {
      "title": "What is a utility middleware?",
      "answer": "Utility middleware in Express refers to built-in or third-party helper functions that simplify common tasks like parsing request bodies, serving static files, and logging.\n\n**Examples of Utility Middleware:**\n1. **express.json()**\n   - Parses incoming JSON request bodies.\n   - Example: `app.use(express.json())`\n\n2. **express.urlencoded()**\n   - Parses URL-encoded form data (e.g., from HTML forms).\n   - Example: `app.use(express.urlencoded({ extended: true }))`\n\n3. **express.static()**\n   - Serves static files such as images, CSS, JavaScript.\n   - Example: `app.use(express.static('public'))`\n\n**Explanation:**\n- These middlewares are not tied to specific routes but provide general-purpose functionality across the application.\n- They are often placed at the top of the middleware stack using `app.use()` so that they can apply to all incoming requests.\n\n**Note:**\n- Utility middleware enhances code readability and reduces the need to manually parse or handle common request features."
    },    
  ],

  "github": [

    {
      title: "How to push a project to GitHub step by step?",
      answer: "```bash\ncd your-project-folder               # Go to your project directory\ngit init                             # Initialize git\ngit remote add origin https://github.com/yourusername/your-repo-name.git  # Link GitHub repo\ngit add .                            # Stage all files\ngit commit -m \"Initial commit\"      # Commit with a message\ngit branch -M main                  # Rename branch to main (optional but recommended)\ngit push -u origin main             # Push code to GitHub\n```"
    },    
    {
      title: "What is Git?",
      answer: "Git is a free and open-source version control system that helps track changes in code, maintain history, and support collaboration."
    },
    {
      title: "What is GitHub?",
      answer: "GitHub is a website where we host Git repositories online. It allows users to share, collaborate, and manage Git-based projects."
    },
    {
      title: "Why is Git useful in software development?",
      answer: "Git helps to:\n- Track changes in code\n- Maintain version history\n- Collaborate with others\n- Revert to previous versions if something breaks"
    },
    {
      title: "How do you configure Git with your identity?",
      answer: "Use the following commands to set your name and email globally:\n- git config --global user.name \"Your Name\"\n- git config --global user.email \"your@email.com\""
    },
    {
      title: "How can you check the current Git configuration?",
      answer: "Use the command:\n- git config --list\nIt displays all the Git configuration details."
    },
    {
      title: "What does the 'git clone' command do?",
      answer: "It clones a remote Git repository to your local machine.\n\nExample:\ngit clone https://github.com/username/project.git"
    },
    {
      title: "What does the 'git status' command do?",
      answer: "It displays the current state of your working directory and staging area.\n\nExample:\nIf a file is modified but not staged, git status will show it under 'Changes not staged for commit'."
    },
    {
      title: "What is the file status lifecycle in Git?",
      answer: "Git file lifecycle includes the following states:\n1. Untracked → file not added to Git\n2. Unmodified → file added and committed\n3. Modified → file edited after commit\n4. Staged → file marked to be committed"
    },
    {
      title: "How does a file move through different states in Git?",
      answer: "Example lifecycle:\n- Create a new file → *Untracked\n- git add filename → **Staged\n- git commit -m \"msg\" → **Unmodified\n- Edit the file → **Modified\n- git add filename → **Staged again\n- git commit → **Unmodified*"
    },
    {
      title: "What does the 'git add' command do?",
      answer: "It adds new or changed files in your working directory to the Git staging area.\n\nExample:\ngit add filename"
    },
    {
      title: "What is the purpose of 'git commit'?",
      answer: "It creates a record of changes added to the staging area.\n\nExample:\ngit commit -m \"Updated README file\""
    },
    {
      title: "How can you add and commit together in one step?",
      answer: "Use the following command:\ngit commit -am \"Your message\"\nThis adds and commits modified files (not new untracked files)."
    },
    {
      title: "What does 'git push' do?",
      answer: "It uploads your local repository content to a remote repository.\n\nExample:\ngit push origin main"
    },
    {
      title: "What is 'git init' used for?",
      answer: "It initializes a new Git repository in your current directory.\n\nExample:\ngit init"
    },
    {
      title: "What does 'git remote add origin <link>' do?",
      answer: "It connects your local repository to a remote one (usually hosted on GitHub).\n\nExample:\ngit remote add origin https://github.com/user/repo.git"
    },
    {
      title: "How do you verify your remote link in Git?",
      answer: "Use the command:\ngit remote -v"
    },
    {
      title: "How to check the branches in your Git repository?",
      answer: "Use the command:\ngit branch"
    },
    {
      title: "How do you rename a Git branch?",
      answer: "Use the command:\ngit branch -m new-name\n\nExample:\ngit branch -m main"
    },
    {
      title: "How do you push your code to a renamed branch?",
      answer: "Use the command:\ngit push origin main"
    },
    {
      title: "What does 'git checkout' do?",
      answer: "It lets you switch to another branch.\n\nExample:\ngit checkout feature"
    },
    {
      title: "How do you create and switch to a new branch in Git?",
      answer: "Use the command:\ngit checkout -b new-branch-name"
    },
    {
      title: "How can you delete a Git branch?",
      answer: "Use the command:\ngit branch -d branch-name\n\nExample:\ngit branch -d old-feature"
    },
    {
      title: "What does 'git push --set-upstream origin branch-name' do?",
      answer: "It links your local branch with the remote branch so future pushes can be done with just 'git push'.\n\nExample:\ngit push --set-upstream origin feature"
    },
    {
      title: "What is forking in GitHub?",
      answer: "Forking is creating a rough copy of someone else's repository under your GitHub account allowing you to make changes without affecting the original project."
    },
    {
      title: "How do you compare two Git branches?",
      answer: "Use the command:\ngit diff <branch-name>\nIt shows the differences between the current branch and the specified one."
    },
    {
      title: "How do you merge one branch into another in Git?",
      answer: "Use the command:\ngit merge <branch-name>\nIt merges changes from the specified branch into the current branch."
    },
    {
      title: "What is a pull request (PR) on GitHub?",
      answer: "A pull request is a way to tell others about changes you've pushed to a branch. It's often used to request merging those changes into another branch (like main)."
    },
    {
      title: "What does 'git pull origin main' do?",
      answer: "It fetches and downloads content from the remote 'main' branch and immediately updates the local branch to match it."
    },
    {
      title: "What is a merge conflict in Git?",
      answer: "A merge conflict occurs when Git is unable to automatically resolve differences between branches—usually when the same lines of code were modified in both branches."
    },
    {
      title: "How do you fix staged changes in Git?",
      answer: "Use the command:\ngit reset <filename>\nIt unstages the file from the staging area."
    },
    {
      title: "How do you undo the last commit in Git (but keep the changes)?",
      answer: "Use the command:\ngit reset HEAD~1\nThis removes the last commit but leaves the changes in your working directory."
    },
    {
      title: "How do you remove a specific commit in Git?",
      answer: "Use the command:\ngit reset <commit-hash>\nThis resets the branch to a specific commit keeping the changes locally."
    },
    {
      title: "How do you permanently remove commits and changes?",
      answer: "Use the command:\ngit reset --hard <commit-hash>\nThis resets the branch to the specified commit and discards all changes after it."
    }
    
  ],

  "backend": [
    {
      "title": "What is Node.js?",
      "answer": "Node.js is a **JavaScript runtime environment** that allows developers to run JavaScript code **outside of the browser**, typically on the server side.\n\n**Key Features:**\n- Built on **Google Chrome's V8 JavaScript engine**\n- Uses an **event-driven, non-blocking I/O model**, making it efficient and scalable\n- Ideal for building fast and lightweight web servers, APIs, and real-time applications\n\n**Example Use Case:**\n```js\nconst http = require('http');\nhttp.createServer((req, res) => {\n  res.write('Hello from Node.js!');\n  res.end();\n}).listen(3000);\n```\n\n**Explanation:**\n- This code starts a simple web server using Node.js that listens on port 3000.\n\n**Common Use Cases:**\n- REST APIs\n- Real-time apps (e.g., chat)\n- File servers\n- Tools and scripts (e.g., CLI tools like npm)\n\n**Note:**\n- Node.js is not a framework; it’s a runtime that can be used with many libraries and frameworks like Express.js."
    },    
    {
      title: "Is Node.js a language, library or framework?",
      answer: "Node.js is none of these. It is a runtime environment that enables JavaScript to run on the server."
    },
    {
      title: "What is Node.js REPL?",
      answer: "REPL stands for Read-Evaluate-Print Loop. It is an interactive shell in Node.js that allows you to run JavaScript commands line-by-line."
    },
    {
      title: "How can you start the Node.js REPL?",
      answer: "Open a terminal and type node then press Enter. You’ll enter an interactive environment where you can execute JS commands like in a console."
    },
    {
      title: "How do you execute a JavaScript file using Node.js?",
      answer: "Use the following command in terminal:\nnode filename.js\n\nExample:\nnode script.js"
    },
    {
      title: "What is the 'process' object in Node.js?",
      answer: "The 'process' object provides information and control over the current Node.js process.\n\nExample:\nprocess.version returns the Node.js version."
    },
    {
      title: "What is 'process.argv' in Node.js?",
      answer: "It is an array that contains command-line arguments passed when the Node.js process was launched.\n\nExample:\nnode script.js A B C"
    },
    {
      title: "How do you access command-line arguments in Node.js?",
      answer: "Use:\nconst args = process.argv;\nThen iterate:\nfor (let i = 0; i < args.length; i++) {\n  console.log(\"Hello to\" args[i]);\n}"
    },
    {
      "title": "What is 'require()' in Node.js?",
      "answer": "`require()` is a built-in function in Node.js used to **import external modules, JSON files, or custom files** into your current JavaScript file.\n\n**Purpose:**\n- Enables code modularity and reuse.\n- Allows access to Node's built-in modules (like `fs`, `http`) or third-party packages (like `express`).\n\n**Syntax:**\n```js\nconst moduleName = require('module-name');\n```\n\n**Examples:**\n1. Importing a built-in module:\n```js\nconst fs = require('fs');\n```\n2. Importing a custom module:\n```js\nconst helper = require('./helper.js');\n```\n3. Importing a third-party package:\n```js\nconst express = require('express');\n```\n\n**When to use `require()` vs `import`:**\n- Use **`require()`**:\n  - In **CommonJS** modules (default in Node.js)\n  - When using older versions of Node.js\n  - In `.js` files **without** `type  : module` in `package.json`\n\n- Use **`import`**:\n  - In **ES Modules (ESM)**\n  - When using modern, top-level `await`, or static imports\n  - In `.mjs` files or `.js` files **with** `type : module` in `package.json`\n\n**Note:**\n- Both `require()` and `import` are used for module loading, but they belong to different module systems (CommonJS vs ES Module).\n- You can't mix them freely unless using dynamic import (`import()`), which returns a promise."
    },          
    {
      "title": "What is 'module.exports' in Node.js?",
      "answer": "`module.exports` is a special object in Node.js used to **export functions, objects, or variables** from one file so that they can be used in another file using `require()`.\n\n**Purpose:**\n- Enables **modular programming** by allowing code to be split across multiple files.\n\n**Example:**\n```js\n// utils.js\nfunction add(a, b) {\n  return a + b;\n}\nmodule.exports = add;\n```\n```js\n// app.js\nconst add = require('./utils');\nconsole.log(add(2, 3)); // 5\n```\n\n**Explanation:**\n- In `utils.js`, the `add` function is exported using `module.exports`.\n- In `app.js`, it is imported using `require()`.\n\n**Note:**\n- You can also export multiple items:\n```js\nmodule.exports = { add, subtract };\n```\n- `module.exports` is used in **CommonJS modules**. In ES Modules, you use `export` and `import` instead."
    },       
    {
      title: "How do you export a single value using 'module.exports'?",
      answer: "Example:\nIn math.js:\nmodule.exports = 123;\n\nIn another file:\nconst someVal = require('./math');\nconsole.log(someVal); // 123"
    },
    {
      "title": "How can you export multiple functions or variables from a module?",
      "answer": "To export multiple functions or variables from a module in Node.js, **group them in an object** and assign that object to `module.exports`.\n\n**Example:**\n```js\n// mathUtils.js\nfunction sum(a, b) {\n  return a + b;\n}\n\nfunction mul(a, b) {\n  return a * b;\n}\n\nconst pi = 3.1416;\n\nmodule.exports = { sum, mul, pi };\n```\n\n**Then import and use them like this:**\n```js\n// app.js\nconst { sum, mul, pi } = require('./mathUtils');\n\nconsole.log(sum(2, 3));  // 5\nconsole.log(mul(2, 3));  // 6\nconsole.log(pi);         // 3.1416\n```\n\n**Note:**\n- You can also export them individually using `exports.name = value`, but assigning an object to `module.exports` is cleaner for multiple exports.\n- This approach is used in **CommonJS modules**."
    },    
    {
      title: "How can you access individual exports from another file?",
      answer: "Use destructuring or dot notation:\nconst math = require('./math');\nconsole.log(math.sum(8 9));"
    },
    {
      title: "What happens if you use 'exports.sum = ...' and 'module.exports = ...' together?",
      answer: "It can lead to unexpected behavior. Prefer using one consistent export style usually module.exports = {...} when exporting an object."
    },
    {
      title: "How do you export constants directly?",
      answer: "You can assign directly:\nexports.g = 9.8;\nexports.pi = 3.14;"
    },
    {
      title: "What is the correct way to require an entire directory as a module?",
      answer: "You can require a directory if it contains an index.js file. That file acts as the entry point.\n\nExample:\nconst info = require('./fruits');"
    },
    {
      "title": "How do you combine multiple modules from a folder?",
      "answer": "To combine multiple modules from a folder, create individual files for each module (e.g., `apple.js`, `banana.js`, `orange.js`), and then use an `index.js` file to **import and export them together**.\n\n**Folder structure:**\n```\nfruits/\n├── apple.js\n├── banana.js\n├── orange.js\n└── index.js\n```\n\n**Example in individual files:**\n```js\n// apple.js\nmodule.exports = 'apple';\n\n// banana.js\nmodule.exports = 'banana';\n\n// orange.js\nmodule.exports = 'orange';\n```\n\n**index.js (combine all):**\n```js\nconst apple = require('./apple');\nconst banana = require('./banana');\nconst orange = require('./orange');\n\nmodule.exports = [apple, banana, orange];\n```\n\n**OR as an object:**\n```js\nmodule.exports = { apple, banana, orange };\n```\n\n**Usage:**\n```js\nconst fruits = require('./fruits');\nconsole.log(fruits); // ['apple', 'banana', 'orange'] or an object depending on export format\n```\n\n**Note:**\n- This is a common pattern used in modular projects to group related logic together and simplify imports."
    },    
    {
      "title": "How do you use exported modules from a directory in another file?",
      "answer": "When a directory contains an `index.js` file that exports modules (as an object or array), you can simply `require()` the folder name in another file.\n\n**Example:**\n```js\n// script.js\nconst info = require('./fruits');\nconsole.log(info); // Will log the array or object exported from fruits/index.js\n```\n\n**Explanation:**\n- Node.js automatically looks for `index.js` when you `require('./folderName')`\n- If `index.js` exports an array:\n  ```js\n  module.exports = ['apple', 'banana', 'orange'];\n  ```\n  You'll get that array in `script.js`\n- If it exports an object:\n  ```js\n  module.exports = { apple, banana, orange };\n  ```\n  You can access individual properties: `info.apple`, `info.banana`, etc.\n\n**Note:**\n- This is a clean and scalable way to organize related modules (e.g., routes, controllers, helpers) into folders."
    },    
    {
      title: "What is NPM in Node.js?",
      answer: "NPM stands for Node Package Manager. It is the standard package manager for Node.js that allows developers to install manage and share packages (libraries)."
    },
    {
      title: "What are the two main roles of NPM?",
      answer: "1. Acts as a library of reusable packages\n2. Provides a command-line tool to manage these packages"
    },
    {
      title: "How do you install a package using NPM?",
      answer: "Use the command:\nnpm install <package-name>\nExample:\nnpm install express"
    },
    {
      title: "What is 'node_modules' in a Node.js project?",
      answer: "It is the directory that contains every installed package (and their sub-dependencies) for your Node.js project."
    },
    {
      title: "What is 'package-lock.json' and what does it do?",
      answer: "It is a file that records the exact version of every installed dependency including all nested dependencies ensuring consistent installs across environments."
    },
    {
      title: "What is 'package.json' used for?",
      answer: "It is the main metadata file for a Node.js project. It contains details like the project name version description scripts and list of dependencies."
    },
    {
      title: "What happens when you run 'npm init'?",
      answer: "It creates a new package.json file by asking the user to enter metadata like project name version entry point author etc."
    },
    {
      title: "What happens if a 'package.json' file already exists and you install another package?",
      answer: "The existing package.json will be updated with the new package entry but a new file will not be created."
    },
    {
      title: "What is the difference between local and global installation in NPM?",
      answer: "Local installation (npm install <package-name>) installs the package in the current project folder whereas global installation (npm install -g <package-name>) installs it system-wide. Global is not advisable for project-specific packages."
    },
    {
      title: "What is the purpose of 'npm link'?",
      answer: "npm link <package-name> creates a symlink to a globally installed package. It's useful during local development of packages."
    },
    {
      title: "What is the difference between 'require' and 'import' in Node.js?",
      answer: "'require' is CommonJS and synchronous while 'import' is ES6 module and asynchronous. 'import' also allows selective loading which helps reduce memory usage."
    },
    {
      title: "Can you selectively import functions using 'require' and 'import'?",
      answer: "With 'require' you import the whole module. With 'import' you can selectively load only what’s needed. Example:\nimport { sum } from './math.js';"
    },
    {
      title: "What setup is required to use 'import' in Node.js?",
      answer: "You must add type: module in package.json and ensure package.json exists in the same directory."
    },
    {
      title: "Give an example of using ES6 import and export.",
      answer: "*math.js*:\nexport const sum = (a b) => a + b;\n\n*script.js*:\nimport { sum } from './math.js';\nconsole.log(sum(1 2));"
    },
    {
      title: "What is the difference between a library and a framework?",
      answer: "A library is a collection of pre-written code for specific tasks (e.g. lodash) while a framework provides a complete structure for app development (e.g. Express.js)."
    },
  {
    title: "What is Express?",
    answer: "Express is a Node.js web application framework that helps in building web applications and APIs. It simplifies server-side programming by handling routing middleware and responses.\nExample: Express is used to create a server that listens for requests on a specific port and responds with data."
  },
  {
    title: "What is the use of Express in Node.js?",
    answer: "Express is used in Node.js for building web applications and RESTful APIs. It helps manage incoming HTTP requests process them and send appropriate responses.\nExample: Using app.get() to respond to a GET request on the home route '/'."
  },
  {
    title: "How to get started with Express?",
    answer: "To start using Express:\n1. Import express using const express = require('express');\n2. Create an app with const app = express();\n3. Define a port and start the server with app.listen(PORT);\nExample:\nconst express = require('express');\nconst app = express();\nconst port = 8080;\napp.listen(port => {\n  console.log(App listening on port ${port});\n});"
  },
  {
    title: "What are Ports in Express?",
    answer: "Ports are logical endpoints in a network that allow data exchange between a web server and a web client. Express servers listen on specific ports to accept requests.\nExample: Port 3000 or 8080 is commonly used in development."
  },
  {
    title: "What is app.use() in Express?",
    answer: "app.use() is a method to define middleware in Express. It runs on every request to the server. Middleware can log modify or end the request/response cycle.\nExample:\napp.use((req res) => {\n  console.log('Request received');\n});"
  },
  {
    title: "What are req and res in Express?",
    answer: "req stands for request and contains information sent by the client. res stands for response and is used to send back data to the client.\nExample:\nres.send('<h1>Fruits</h1><ul><li>Apple</li></ul>');"
  },
  {
    title: "What is Routing in Express?",
    answer: "Routing is the process of selecting a path for traffic in a network. In Express it means defining endpoints (URIs) to handle client requests.\nExample:\napp.get('/', (req res) => {\n  res.send('You contacted root path');\n});"
  },
  {
    title: "What is a wildcard route in Express?",
    answer: "A wildcard route ('*') is used to handle undefined or invalid paths.\nExample:\napp.get('*', (req res) => {\n  res.send('This path does not exist');\n});"
  },
  {
    title: "How to handle POST requests in Express?",
    answer: "Use the app.post() method to handle HTTP POST requests sent to the server.\nExample:\napp.post('/', (req res) => {\n  res.send('You sent a POST request to root');\n});"
  },
  {
    title: "What is Nodemon?",
    answer: "Nodemon is a utility that monitors changes in your source code and automatically restarts the server. Useful during development.\nInstall using:\nnpm install -g nodemon"
  },
  {
    title: "What is a Path Parameter in Express?",
    answer: "Path parameters are dynamic segments in the URL defined using a colon (:).\nExample:\napp.get('/user/:username/:id', (req res) => {\n  const { username id } = req.params;\n  res.send(<h1>Welcome to the page of ${username}</h1>);\n});"
  },
  {
    title: "What is a Query String in Express?",
    answer: "Query strings are used to send data to the server via URL usually after the '?' symbol.\nExample:\napp.get('/search', (req res) => {\n  const { q } = req.query;\n  if (!q) {\n    res.send('No search query');\n  } else {\n    res.send(These are the results for: ${q});\n  }\n});"
  },
  {
    title: "What is EJS in Express?",
    answer: "EJS (Embedded JavaScript Templates) is a simple templating language that lets you generate HTML markup with plain JavaScript.\nExample: You can embed JS logic like <% if(user) { %> inside HTML templates."
  },
  {
    title: "How to install and set up EJS in Express?",
    answer: "Steps:\n1. Initialize project: npm init -y\n2. Install dependencies:\n   npm install express ejs\n3. Set view engine:\n   app.set('view engine' 'ejs');\n4. Set views directory:\n   const path = require('path');\n   app.set('views' path.join(__dirname 'views'));"
  },
  {
    title: "How to render an EJS file in Express?",
    answer: "Use res.render('filename') to render an EJS template file.\nExample:\napp.get('/', (req res) => {\n  res.render('home.ejs');\n});\nNote: home.ejs must be in the 'views' folder."
  },
  {
    title: "How to send normal text in Express?",
    answer: "Use res.send() to return plain text or HTML directly.\nExample:\napp.get('/hello', (req res) => {\n  res.send('Hello');\n});"
  },
  {
    title: "How to start an Express server with EJS setup?",
    answer: "Example:\napp.listen(port () => {\n  console.log(Listening on port ${port});\n});"
  },
  {
    title: "What is Interpolation in EJS?",
    answer: "Interpolation is embedding JavaScript expressions within HTML templates using special EJS syntax.\nExample:\n<%= variableName %> will print the value of variableName inside the HTML."
  },
  {
    title: "How to pass dynamic data to EJS templates?",
    answer: "You can pass variables using res.render and then access them in the EJS file.\nExample:\napp.get('/rolldice', (req res) => {\n  let diceval = Math.floor(Math.random() * 6) + 1;\n  res.render('rolldice.ejs' { diceval });\n});\nIn rolldice.ejs:\n<h1>Dice gave value: <%= diceval %></h1>"
  },
  {
    title: "How to use Conditional Statements in EJS?",
    answer: "You can use standard JavaScript if-else statements within EJS syntax.\nExample:\n<% if (diceval === 6) { %>\n  <h1>Nice! Throw once again</h1>\n<% } %>"
  },
  {
    title: "How to use Loops in EJS?",
    answer: "You can use JavaScript for or forEach loops within EJS to iterate over data.\nExample:\n<% for(let name of followers) { %>\n  <li><%= name %></li>\n<% } %>"
  },
  {
    title: "How to serve static files in Express?",
    answer: "Use express.static middleware to serve static files like CSS images JS.\nExample:\napp.use(express.static(path.join(__dirname 'public')));\nThis will make all files in the 'public' folder accessible."
  },
  {
    title: "How to use Includes in EJS?",
    answer: "EJS includes allow you to reuse template parts like headers or footers.\nExample:\n<%- include('includes/header.ejs') %>"
  },
  {
    title: "What is a GET request in Express?",
    answer: "A GET request is used to request data from a server. It typically sends data via query strings in the URL.\nExample: http://localhost:3000/register?user=John\nData is limited sent as strings and visible in the URL."
  },
  {
    title: "What is a POST request in Express?",
    answer: "A POST request is used to send data to the server typically for creating or updating resources.\nData is sent in the request body and can be of any type (string JSON etc.). It is not visible in the URL."
  },
  {
    title: "How to handle POST request data in Express?",
    answer: "You need to use middleware to parse the request body:\n1. app.use(express.urlencoded({ extended: true })); // For form data\n2. app.use(express.json()); // For JSON data"
  },
  {
    title: "How to create a GET route with query string handling?",
    answer: "Example:\napp.get('/register', (req res) => {\n  const { user password } = req.query;\n  res.send(Standard GET response. Welcome ${user}!);\n});"
  },
  {
    title: "How to create a POST route with body data handling?",
    answer: "Example:\napp.post('/register', (req res) => {\n  console.log(req.body);\n  res.send('Standard POST response');\n});"
  },
  {
    title: "How does a form send a GET request?",
    answer: "Example HTML:\n<form method='GET' action='http://localhost:3000/register'>\n  <!-- Inputs and button -->\n</form>\nThis will submit query parameters visible in the URL."
  },
    
  ],

  "redux": [
    {
      title: "What is Redux?",
      answer: "Redux is a state management library for JavaScript apps. It is built for larger more complex applications. Redux Toolkit is the official recommended way to write Redux code."
    },
    {
      title: "What is a Store in Redux?",
      answer: "A centralized store that holds the whole state tree of your application."
    },
    {
      title: "What are Reducers in Redux?",
      answer: "Reducers are functions that take the current state and an action as arguments and return a new state result."
    },
    {
      title: "What is an Action in Redux?",
      answer: "An Action is a plain JavaScript object that has a type field like events."
    },
    {
      title: "What is a Slice in Redux Toolkit?",
      answer: "A slice is a collection of Redux reducer logic and actions for a single feature bundled together."
    },
    {
      title: "How to design the Store for a Todo App?",
      answer: "The store for a Todo app can be structured as:\n{\n  todo: [\n    { id, task, isDone }\n  ]\n}"
    },
    {
      title: "Example of a Redux Action to add a Todo",
      answer: "{\n  type: 'ADD_TODO',\n  payload: 'write code'\n}"
    },
    {
      title: "How does Redux Toolkit create reducers?",
      answer: "Redux Toolkit automatically generates action creators and reducers using a syntax like:\n(state, action) => { /* update state */ }\n\nIt simplifies writing immutable update logic using 'mutating' syntax internally (powered by Immer)."
    },
    {
      title: "What is the Provider component in Redux?",
      answer: "<Provider> is a React component that makes the Redux store available to any nested components that need to access the store."
    },
    {
      title: "How to dispatch actions in Redux?",
      answer: "Use the useDispatch hook to send or dispatch an action to the Redux store. You provide the action as an argument to the dispatch function.\n\nExample:\nconst dispatch = useDispatch();\ndispatch(addTodo('Learn Redux'));"
    },
    {
      title: "How to read state from Redux store?",
      answer: "Use the useSelector hook to extract data from the Redux store state using a selector function.\n\nExample:\nconst todos = useSelector(state => state.todos);"
    },
  ],

  "docker": [
    {
      title: "How to list all local Docker images?",
      answer: "docker images"
    },
    {
      title: "How to delete a Docker image?",
      answer: "docker rmi <image-name>"
    },
    {
      title: "How to remove all unused Docker images?",
      answer: "docker image prune"
    },
    {
      title: "How to build a Docker image from a Dockerfile?",
      answer: "docker build -t <image-name>:<version> ."
    },
    {
      title: "How to list all Docker containers (running and stopped)?",
      answer: "docker ps -a"
    },
    {
      title: "How to list only running Docker containers?",
      answer: "docker ps"
    },
    {
      title: "How to create and run a new Docker container?",
      answer: "docker run <image-name>"
    },
    {
      title: "How to run a Docker container in the background?",
      answer: "docker run -d <image-name>"
    },
    {
      title: "How to run a Docker container with a custom name?",
      answer: "docker run --name <container-name> <image-name>"
    },
    {
      title: "How to stop a Docker container?",
      answer: "docker stop <container-name>"
    },
    {
      title: "How to start a Docker container?",
      answer: "docker start <container-name>"
    },
    {
      title: "How to restart a Docker container?",
      answer: "docker restart <container-name>"
    },
    {
      title: "How to remove a Docker container?",
      answer: "docker rm <container-name>"
    },
    {
      title: "How to inspect details of a container?",
      answer: "docker inspect <container-name>"
    },
    {
      title: "How to fetch logs of a container?",
      answer: "docker logs <container-name>"
    },
    {
      title: "How to run a shell inside a running container?",
      answer: "docker exec -it <container-name> /bin/bash"
    },
    {
      title: "How to set environment variables in a Docker container?",
      answer: "docker run -e <key>=<value> <image-name>"
    },
    {
      title: "How to map a host port to a container port?",
      answer: "docker run -p <host-port>:<container-port> <image-name>"
    },
    {
      title: "How to remove an image?",
      answer: "docker rmi <image-name>"
    },
    {
      title: "How to push an image to DockerHub?",
      answer: "docker push <username>/<image-name>"
    },
    {
      title: "How to login to DockerHub?",
      answer: "docker login"
    },
    {
      title: "How to logout from DockerHub?",
      answer: "docker logout"
    },
    {
      title: "How to search for an image on DockerHub?",
      answer: "docker search <image-name>"
    },
    {
      title: "How to list all Docker networks?",
      answer: "docker network ls"
    },
    {
      title: "How to create a Docker network?",
      answer: "docker network create <network-name>"
    },
    {
      title: "How to inspect a Docker network?",
      answer: "docker network inspect <network-name>"
    },
    {
      title: "How to remove a Docker network?",
      answer: "docker network rm <network-name>"
    },
    {
      title: "How to prune all unused Docker networks?",
      answer: "docker network prune"
    },
    {
      title: "How to list all Docker volumes?",
      answer: "docker volume ls"
    },
    {
      title: "How to create a named Docker volume?",
      answer: "docker volume create <volume-name>"
    },
    {
      title: "How to inspect a Docker volume?",
      answer: "docker volume inspect <volume-name>"
    },
    {
      title: "How to remove a Docker volume?",
      answer: "docker volume rm <volume-name>"
    },
    {
      title: "How to remove all unused Docker volumes?",
      answer: "docker volume prune"
    },
    {
      title: "How to create a bind mount volume?",
      answer: "docker run -v <host-path>:<container-path> <image-name>"
    },
    {
      title: "How to create a named volume mount?",
      answer: "docker run -v <volume-name>:<container-path> <image-name>"
    },
  ],



  "cicd": [
  {
    "title": "What is CI/CD?",
    "answer": "CI (Continuous Integration) is the practice of frequently merging code changes into a shared repository, where automated builds and tests are run. CD (Continuous Delivery/Deployment) is the process of automatically delivering or deploying applications to production after passing CI stages."
  },
  {
    "title": "What are the benefits of CI/CD?",
    "answer": "Faster delivery, reduced integration issues, higher code quality, automated testing, early bug detection, improved collaboration, and more reliable deployments."
  },
  {
    "title": "What are the main stages of a CI/CD pipeline?",
    "answer": "1. Source (commit/push to repo)\n2. Build (compile, package)\n3. Test (unit, integration, e2e)\n4. Artifact management (store build outputs)\n5. Deploy (staging/production)\n6. Monitor (logs, metrics, alerts)"
  },
  {
    "title": "How to define a CI/CD pipeline in GitHub Actions?",
    "answer": "Create `.github/workflows/ci.yml` with jobs:\n```yaml\nname: CI\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Setup Node.js\n        uses: actions/setup-node@v3\n        with:\n          node-version: '16'\n      - run: npm install && npm test\n```"
  },
  {
    "title": "How to define a CI/CD pipeline in GitLab CI/CD?",
    "answer": "Use `.gitlab-ci.yml`:\n```yaml\nstages: [build, test, deploy]\n\nbuild:\n  stage: build\n  script:\n    - npm install\n    - npm run build\n\ntest:\n  stage: test\n  script:\n    - npm test\n\ndeploy:\n  stage: deploy\n  script:\n    - ./deploy.sh\n  only:\n    - main\n```"
  },
  {
    "title": "How to define a CI/CD pipeline in Jenkins?",
    "answer": "Use a `Jenkinsfile`:\n```groovy\npipeline {\n  agent any\n  stages {\n    stage('Build') {\n      steps { sh 'npm install && npm run build' }\n    }\n    stage('Test') {\n      steps { sh 'npm test' }\n    }\n    stage('Deploy') {\n      steps { sh './deploy.sh' }\n    }\n  }\n}\n```"
  },
  {
    "title": "How to define a CI/CD pipeline in CircleCI?",
    "answer": "Use `.circleci/config.yml`:\n```yaml\nversion: 2.1\njobs:\n  build:\n    docker:\n      - image: circleci/node:16\n    steps:\n      - checkout\n      - run: npm install\n      - run: npm test\nworkflows:\n  version: 2\n  build_and_test:\n    jobs:\n      - build\n```"
  },
  {
    "title": "How to define a CI/CD pipeline in Travis CI?",
    "answer": "Use `.travis.yml`:\n```yaml\nlanguage: node_js\nnode_js:\n  - '16'\nscript:\n  - npm install\n  - npm test\n```"
  },
  {
    "title": "How to define a CI/CD pipeline in Azure DevOps?",
    "answer": "Use `azure-pipelines.yml`:\n```yaml\ntrigger:\n- main\npool:\n  vmImage: ubuntu-latest\nsteps:\n- task: NodeTool@0\n  inputs:\n    versionSpec: '16.x'\n- script: npm install && npm test\n  displayName: 'Install and Test'\n```"
  },
  {
    "title": "How to define a CI/CD pipeline in Bitbucket Pipelines?",
    "answer": "Use `bitbucket-pipelines.yml`:\n```yaml\npipelines:\n  default:\n    - step:\n        image: node:16\n        script:\n          - npm install\n          - npm test\n```"
  },
  {
    "title": "How to run unit tests in a CI pipeline?",
    "answer": "Add a test stage in the pipeline config, e.g. `npm test`, `pytest`, `mvn test` depending on the language."
  },
  {
    "title": "How to store build artifacts in CI/CD?",
    "answer": "Most CI/CD platforms support artifact storage:\n- GitHub Actions: `actions/upload-artifact`\n- GitLab: `artifacts: paths`\n- Jenkins: `archiveArtifacts`\n- CircleCI: `store_artifacts`"
  },
  {
    "title": "How to deploy applications to Kubernetes with CI/CD?",
    "answer": "Integrate with `kubectl` or Helm:\n```yaml\n- name: Deploy to K8s\n  run: |\n    kubectl apply -f k8s/deployment.yaml\n```"
  },
  {
    "title": "How to use Docker in CI/CD pipelines?",
    "answer": "Build and push images during pipeline:\n```yaml\n- run: docker build -t username/app:latest .\n- run: docker push username/app:latest\n```"
  },
  {
    "title": "How to use Helm in CI/CD?",
    "answer": "Use Helm to package and deploy:\n```yaml\n- run: helm upgrade --install my-app ./charts/my-app --namespace prod\n```"
  },
  {
    "title": "How to manage secrets in CI/CD pipelines?",
    "answer": "Use secret managers:\n- GitHub Actions: `secrets.GITHUB_TOKEN`\n- GitLab: `CI/CD Variables`\n- Jenkins: Credentials plugin\n- Azure DevOps: Secret Variables\n- Vault/KMS for enterprise"
  },
  {
    "title": "How to rollback a failed deployment in CI/CD?",
    "answer": "Use:\n- GitLab: `environment: on_stop`\n- Kubernetes: `kubectl rollout undo`\n- Helm: `helm rollback`\n- Jenkins scripted rollback step"
  },
  {
    "title": "How to add caching in CI/CD?",
    "answer": "Use caching to speed up builds:\n- GitHub: `actions/cache`\n- GitLab: `cache:` keyword\n- CircleCI: `save_cache` and `restore_cache`\n- Jenkins: custom caching scripts"
  },
  {
    "title": "How to trigger pipelines automatically?",
    "answer": "Pipelines are triggered by:\n- Git push/PR (default)\n- Scheduled CRON jobs\n- Manual triggers\n- API triggers\n- Webhooks from other services"
  },
  {
    "title": "How to deploy to AWS using CI/CD?",
    "answer": "Use AWS CLI or GitHub Actions/Azure/GitLab integrations:\n```yaml\n- run: aws s3 sync build/ s3://my-bucket\n- run: aws ecs update-service --cluster my-cluster --service my-service --force-new-deployment\n```"
  },
  {
    "title": "How to deploy to GCP using CI/CD?",
    "answer": "Authenticate with `gcloud`:\n```yaml\n- run: gcloud auth activate-service-account --key-file key.json\n- run: gcloud app deploy\n```"
  },
  {
    "title": "How to deploy to Azure using CI/CD?",
    "answer": "Use `az` CLI or Azure DevOps tasks:\n```yaml\n- run: az webapp up --name myapp --resource-group myRG\n```"
  },
  {
    "title": "How to add notifications in CI/CD pipelines?",
    "answer": "Integrate Slack, MS Teams, Email:\n- GitHub: `actions/notifications`\n- GitLab: Slack/Webhook integrations\n- Jenkins: Slack plugin"
  },
  {
    "title": "How to ensure zero-downtime deployments?",
    "answer": "Use rolling deployments, blue-green deployments, or canary releases with Kubernetes, Helm, ArgoCD, or feature flags."
  },
  {
    "title": "How to integrate security checks in CI/CD?",
    "answer": "Add SAST, DAST, dependency scans:\n- `npm audit`\n- `trivy fs .`\n- `sonarqube`\n- `gitlab sast` template"
  },
  {
    "title": "How to monitor CI/CD pipelines?",
    "answer": "Use:\n- GitHub Actions logs & insights\n- GitLab pipeline dashboards\n- Jenkins Blue Ocean\n- Prometheus + Grafana for metrics"
  },
  {
    "title": "What are best practices for CI/CD pipelines?",
    "answer": "- Keep pipelines fast and modular\n- Use caching and parallel jobs\n- Secure secrets\n- Automate rollbacks\n- Monitor deployments\n- Run automated tests\n- Keep configs in version control"
  }
],


"aws": [
  {
    "title": "How to configure AWS CLI?",
    "answer": "aws configure\n(Then enter AWS Access Key, Secret Key, region, and output format)"
  },
  {
    "title": "How to list all configured AWS profiles?",
    "answer": "cat ~/.aws/config"
  },
  {
    "title": "How to switch AWS profile?",
    "answer": "aws s3 ls --profile <profile-name>"
  },
  {
    "title": "How to create an S3 bucket?",
    "answer": "aws s3 mb s3://<bucket-name>"
  },
  {
    "title": "How to list all S3 buckets?",
    "answer": "aws s3 ls"
  },
  {
    "title": "How to upload a file to S3?",
    "answer": "aws s3 cp file.txt s3://<bucket-name>/"
  },
  {
    "title": "How to download a file from S3?",
    "answer": "aws s3 cp s3://<bucket-name>/file.txt ./"
  },
  {
    "title": "How to sync local folder with S3 bucket?",
    "answer": "aws s3 sync ./local-folder s3://<bucket-name>"
  },
  {
    "title": "How to remove a file from S3?",
    "answer": "aws s3 rm s3://<bucket-name>/file.txt"
  },
  {
    "title": "How to remove an S3 bucket?",
    "answer": "aws s3 rb s3://<bucket-name> --force"
  },
  {
    "title": "How to launch a new EC2 instance?",
    "answer": "aws ec2 run-instances --image-id <ami-id> --count 1 --instance-type t2.micro --key-name <key> --security-groups <sg>"
  },
  {
    "title": "How to list running EC2 instances?",
    "answer": "aws ec2 describe-instances --filters Name=instance-state-name,Values=running"
  },
  {
    "title": "How to stop an EC2 instance?",
    "answer": "aws ec2 stop-instances --instance-ids <instance-id>"
  },
  {
    "title": "How to start an EC2 instance?",
    "answer": "aws ec2 start-instances --instance-ids <instance-id>"
  },
  {
    "title": "How to terminate an EC2 instance?",
    "answer": "aws ec2 terminate-instances --instance-ids <instance-id>"
  },
  {
    "title": "How to connect to an EC2 instance?",
    "answer": "ssh -i <key.pem> ec2-user@<public-dns>"
  },
  {
    "title": "How to create an RDS MySQL instance?",
    "answer": "aws rds create-db-instance --db-instance-identifier mydb --db-instance-class db.t3.micro --engine mysql --master-username admin --master-user-password <password> --allocated-storage 20"
  },
  {
    "title": "How to list all RDS instances?",
    "answer": "aws rds describe-db-instances"
  },
  {
    "title": "How to delete an RDS instance?",
    "answer": "aws rds delete-db-instance --db-instance-identifier mydb --skip-final-snapshot"
  },
  {
    "title": "How to create a Lambda function?",
    "answer": "aws lambda create-function --function-name my-function --runtime nodejs16.x --role <iam-role-arn> --handler index.handler --zip-file fileb://function.zip"
  },
  {
    "title": "How to invoke a Lambda function?",
    "answer": "aws lambda invoke --function-name my-function output.json"
  },
  {
    "title": "How to list all Lambda functions?",
    "answer": "aws lambda list-functions"
  },
  {
    "title": "How to delete a Lambda function?",
    "answer": "aws lambda delete-function --function-name my-function"
  },
  {
    "title": "How to create an IAM user?",
    "answer": "aws iam create-user --user-name <username>"
  },
  {
    "title": "How to attach a policy to an IAM user?",
    "answer": "aws iam attach-user-policy --user-name <username> --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess"
  },
  {
    "title": "How to create an IAM role?",
    "answer": "aws iam create-role --role-name <role-name> --assume-role-policy-document file://trust-policy.json"
  },
  {
    "title": "How to list all IAM users?",
    "answer": "aws iam list-users"
  },
  {
    "title": "How to create a new VPC?",
    "answer": "aws ec2 create-vpc --cidr-block 10.0.0.0/16"
  },
  {
    "title": "How to list all VPCs?",
    "answer": "aws ec2 describe-vpcs"
  },
  {
    "title": "How to create a security group?",
    "answer": "aws ec2 create-security-group --group-name my-sg --description \"My security group\" --vpc-id <vpc-id>"
  },
  {
    "title": "How to authorize inbound SSH in security group?",
    "answer": "aws ec2 authorize-security-group-ingress --group-id <sg-id> --protocol tcp --port 22 --cidr 0.0.0.0/0"
  },
  {
    "title": "How to create a CloudFormation stack?",
    "answer": "aws cloudformation create-stack --stack-name mystack --template-body file://template.yaml"
  },
  {
    "title": "How to update a CloudFormation stack?",
    "answer": "aws cloudformation update-stack --stack-name mystack --template-body file://template.yaml"
  },
  {
    "title": "How to delete a CloudFormation stack?",
    "answer": "aws cloudformation delete-stack --stack-name mystack"
  },
  {
    "title": "How to create an ECS cluster?",
    "answer": "aws ecs create-cluster --cluster-name my-cluster"
  },
  {
    "title": "How to register a new ECS task definition?",
    "answer": "aws ecs register-task-definition --cli-input-json file://task-def.json"
  },
  {
    "title": "How to run an ECS task?",
    "answer": "aws ecs run-task --cluster my-cluster --task-definition my-task"
  },
  {
    "title": "How to create an EKS cluster?",
    "answer": "aws eks create-cluster --name my-cluster --role-arn <role-arn> --resources-vpc-config subnetIds=<subnet-ids>,securityGroupIds=<sg-ids>"
  },
  {
    "title": "How to update kubeconfig for EKS?",
    "answer": "aws eks update-kubeconfig --name my-cluster"
  },
  {
    "title": "How to create a CloudWatch log group?",
    "answer": "aws logs create-log-group --log-group-name my-log-group"
  },
  {
    "title": "How to put a custom metric in CloudWatch?",
    "answer": "aws cloudwatch put-metric-data --metric-name PageLoadTime --namespace MyApp --value 123"
  },
  {
    "title": "How to create an SNS topic?",
    "answer": "aws sns create-topic --name my-topic"
  },
  {
    "title": "How to subscribe to an SNS topic?",
    "answer": "aws sns subscribe --topic-arn <topic-arn> --protocol email --notification-endpoint <email>"
  },
  {
    "title": "How to publish a message to an SNS topic?",
    "answer": "aws sns publish --topic-arn <topic-arn> --message \"Hello World\""
  },
  {
    "title": "How to create an SQS queue?",
    "answer": "aws sqs create-queue --queue-name my-queue"
  },
  {
    "title": "How to send a message to SQS queue?",
    "answer": "aws sqs send-message --queue-url <queue-url> --message-body \"Hello Queue\""
  },
  {
    "title": "How to receive messages from an SQS queue?",
    "answer": "aws sqs receive-message --queue-url <queue-url>"
  },
  {
    "title": "What are AWS best practices?",
    "answer": "- Use IAM roles instead of access keys\n- Enable CloudTrail for auditing\n- Apply least privilege principle\n- Use S3 versioning & encryption\n- Use Auto Scaling for EC2\n- Monitor with CloudWatch\n- Automate infrastructure with CloudFormation/Terraform"
  }
],

"finance":[
    {
      title: "What is inflation?",
      answer: "Inflation means the increase in prices of goods and services over time. Because of inflation, the value of money decreases every year. Example: something costing ₹100 today may cost ₹108 next year."
    },
    {
      title: "Why is inflation called the enemy of savings?",
      answer: "Inflation reduces the purchasing power of money. If your money grows slower than inflation, you actually become poorer in real terms."
    },
    {
      title: "What is purchasing power?",
      answer: "Purchasing power means how many goods or services you can buy with your money. Inflation reduces purchasing power."
    },
    {
      title: "Why is inflation dangerous for long-term savings?",
      answer: "Because inflation keeps reducing the value of money every year. If savings are not invested properly, wealth gets destroyed slowly."
    },
    {
      title: "What is lifestyle inflation?",
      answer: "Lifestyle inflation means increasing expenses as income increases. Example: buying expensive phones, cars, vacations, and luxury items after salary increases."
    },
    {
      title: "Why do people struggle to stop earning money?",
      answer: "Because inflation continuously increases expenses, so people need more income to maintain the same lifestyle."
    },
    {
      title: "What is compounding?",
      answer: "Compounding means earning returns on both the original investment and previous returns. It helps money grow faster over time."
    },
    {
      title: "Why is compounding powerful?",
      answer: "Because wealth grows exponentially over time when returns keep getting reinvested."
    },
    {
      title: "What destroys compounding?",
      answer: "Inflation, unnecessary withdrawals, bad investments, and high taxes reduce the power of compounding."
    },
    {
      title: "What is the Rule of 72?",
      answer: "Rule of 72 helps estimate how many years money takes to double.\nFormula: 72 ÷ annual return rate."
    },
    {
      title: "How long does money take to double at 12% return?",
      answer: "Using Rule of 72:\n72 ÷ 12 = 6 years approximately."
    },
    {
      title: "Why is long-term investing important?",
      answer: "Long-term investing allows compounding to work effectively and reduces short-term market risks."
    },
    {
      title: "What is real return?",
      answer: "Real return means actual return after subtracting inflation.\nFormula:\nReal Return = Investment Return - Inflation Rate"
    },
    {
      title: "Why can FD returns feel low in reality?",
      answer: "Because after tax and inflation, actual wealth growth may become very small or even negative."
    },
    {
      title: "What is an index fund?",
      answer: "An index fund is a mutual fund that copies a market index like Nifty 50."
    },
    {
      title: "Why are index funds popular?",
      answer: "Because they have low fees, low management risk, and are good for beginners."
    },
    {
      title: "What is SIP?",
      answer: "SIP (Systematic Investment Plan) means investing a fixed amount regularly in mutual funds."
    },
    {
      title: "Why is SIP useful?",
      answer: "SIP helps in disciplined investing and averages buying cost during market ups and downs."
    },
    {
      title: "What is lump sum investing?",
      answer: "Investing a large amount at one time is called lump sum investing."
    },
    {
      title: "When is lump sum investing considered safer?",
      answer: "Generally when the market is cheap or undervalued."
    },
    {
      title: "Why is timing the market difficult?",
      answer: "Because nobody can consistently predict market tops and bottoms accurately."
    },
    {
      title: "What does 'Buy low, sell high' mean?",
      answer: "It means purchasing investments when prices are cheap and selling when prices become expensive."
    },
    {
      title: "What is equity investment?",
      answer: "Equity investment means investing money in company ownership through stocks or equity mutual funds."
    },
    {
      title: "Who should invest in equity?",
      answer: "People who do not need the invested money for at least 10 years."
    },
    {
      title: "Why is equity risky in the short term?",
      answer: "Because stock prices fluctuate heavily in short periods."
    },
    {
      title: "Why does equity perform well in the long run?",
      answer: "Because businesses grow earnings over time, which increases stock prices."
    },
    {
      title: "What is diversification?",
      answer: "Diversification means spreading investments across multiple assets to reduce risk."
    },
    {
      title: "How do mutual funds reduce risk?",
      answer: "They invest in many companies instead of one single stock."
    },
    {
      title: "What is an expense ratio?",
      answer: "Expense ratio is the yearly fee charged by a mutual fund."
    },
    {
      title: "Why is a low expense ratio important?",
      answer: "High fees reduce long-term returns significantly."
    },
    {
      title: "What is a large-cap company?",
      answer: "A large-cap company is a well-established company with high market value."
    },
    {
      title: "What is a mid-cap company?",
      answer: "Mid-cap companies are medium-sized businesses with moderate growth and risk."
    },
    {
      title: "What is a small-cap company?",
      answer: "Small-cap companies are smaller businesses with high growth potential and high risk."
    },
    {
      title: "Why are small-cap stocks risky?",
      answer: "Because smaller companies are more volatile and financially unstable."
    },
    {
      title: "What is Nifty 50?",
      answer: "Nifty 50 is an index representing 50 major companies listed on the Indian stock market."
    },
    {
      title: "What is P/E ratio?",
      answer: "P/E ratio means Price to Earnings ratio.\nFormula:\nP/E = Share Price ÷ Earnings per Share"
    },
    {
      title: "What does a high P/E ratio indicate?",
      answer: "It usually indicates the market or stock is expensive."
    },
    {
      title: "What does a low P/E ratio indicate?",
      answer: "It may indicate the market or stock is cheap or undervalued."
    },
    {
      title: "Why is P/E ratio important?",
      answer: "It helps investors judge whether the market is cheap, fair, or expensive."
    },
    {
      title: "What is Market Cap to GDP ratio?",
      answer: "It compares total stock market value with the country's GDP to estimate market valuation."
    },
    {
      title: "What is a market bubble?",
      answer: "A market bubble happens when asset prices rise too much beyond their real value due to greed and hype."
    },
    {
      title: "What are signs of an expensive market?",
      answer: "High optimism, IPO craze, media excitement, and high P/E ratios."
    },
    {
      title: "What are signs of a cheap market?",
      answer: "Fear, panic selling, and negative sentiment among investors."
    },
    {
      title: "What is a risk-free rate?",
      answer: "Risk-free rate is the return from extremely safe investments like government bonds."
    },
    {
      title: "What is repo rate?",
      answer: "Repo rate is the interest rate at which RBI lends money to banks."
    },
    {
      title: "How does RBI repo rate affect investments?",
      answer: "Higher repo rates increase FD and bond returns but may slow stock market growth."
    },
    {
      title: "What is fundamental analysis?",
      answer: "Fundamental analysis means studying a company's business, profits, debt, and growth before investing."
    },
    {
      title: "What is revenue or top line?",
      answer: "Revenue is the total sales or income generated by a business."
    },
    {
      title: "What is net profit or bottom line?",
      answer: "Net profit is the money left after all expenses and taxes."
    },
    {
      title: "What is gross profit margin?",
      answer: "Gross profit margin shows how much profit remains after production costs."
    },
    {
      title: "What is operating profit margin?",
      answer: "It shows profitability after operational expenses."
    },
    {
      title: "What is free cash flow?",
      answer: "Free cash flow is the cash left after business expenses and investments."
    },
    {
      title: "Why is cash flow important?",
      answer: "Because businesses need real cash to survive and grow."
    },
    {
      title: "What is debt-to-equity ratio?",
      answer: "It measures how much debt a company has compared to shareholders' money."
    },
    {
      title: "Why is high debt risky?",
      answer: "High debt increases interest burden and bankruptcy risk."
    },
    {
      title: "What is MOAT in investing?",
      answer: "MOAT means a company's competitive advantage that protects it from competitors."
    },
    {
      title: "What is EBITDA?",
      answer: "EBITDA means Earnings Before Interest, Taxes, Depreciation, and Amortization."
    },
    {
      title: "What is depreciation?",
      answer: "Depreciation is the reduction in value of physical assets over time."
    },
    {
      title: "What is amortization?",
      answer: "Amortization is gradual reduction of intangible asset value over time."
    },
    {
      title: "What are debt mutual funds?",
      answer: "Debt mutual funds invest in fixed-income instruments like bonds and treasury bills."
    },
    {
      title: "Why are debt funds considered safer than equity?",
      answer: "Because they are less volatile and mainly invest in fixed-income securities."
    },
    {
      title: "What is interest rate risk?",
      answer: "Interest rate risk means bond prices may fall when interest rates rise."
    },
    {
      title: "What is default risk?",
      answer: "Default risk means the borrower may fail to repay money."
    },
    {
      title: "What are treasury bills?",
      answer: "Treasury bills are short-term government securities with very low risk."
    },
    {
      title: "What are government bonds?",
      answer: "Government bonds are loans given to the government for fixed interest returns."
    },
    {
      title: "Why are government bonds safer?",
      answer: "Because the government has very low default risk."
    },
    {
      title: "What are corporate bonds?",
      answer: "Corporate bonds are loans given to companies in exchange for interest."
    },
    {
      title: "Why do corporate bonds offer higher returns?",
      answer: "Because companies carry more default risk than governments."
    },
    {
      title: "What are liquid funds?",
      answer: "Liquid funds are debt funds investing in very short-term securities."
    },
    {
      title: "What are overnight funds?",
      answer: "Overnight funds invest in securities maturing within one day."
    },
    {
      title: "What are short-term debt funds?",
      answer: "These funds invest in bonds with shorter maturity periods."
    },
    {
      title: "What are long-term debt funds?",
      answer: "These invest in long-duration bonds and are sensitive to interest rates."
    },
    {
      title: "Why are long-term debt funds risky?",
      answer: "Because their prices fluctuate more when interest rates change."
    },
    {
      title: "What is AUM in mutual funds?",
      answer: "AUM means Assets Under Management — the total money managed by the fund."
    },
    {
      title: "Why is higher AUM generally preferred?",
      answer: "Because larger funds are often more stable and trusted."
    },
    {
      title: "What is real estate investment?",
      answer: "Real estate investment means buying property or land to earn appreciation or rental income."
    },
    {
      title: "Why is real estate less liquid?",
      answer: "Because properties take time to sell."
    },
    {
      title: "What is rental yield?",
      answer: "Rental yield is annual rent earned as a percentage of property value."
    },
    {
      title: "Why is location important in real estate?",
      answer: "Because property demand and price growth depend heavily on location."
    },
    {
      title: "Why should paperwork be checked carefully in property buying?",
      answer: "To avoid legal disputes and ownership fraud."
    },
    {
      title: "What is a home loan background check advantage?",
      answer: "Banks verify property legality before approving loans, reducing fraud risk."
    },
    {
      title: "Why are big builders considered safer?",
      answer: "Because established builders are generally more reliable and financially stable."
    },
    {
      title: "Why is selling property difficult?",
      answer: "Because real estate transactions take time and depend on buyer demand."
    },
    {
      title: "What is liquidity in finance?",
      answer: "Liquidity means how quickly an asset can be converted into cash."
    },
    {
      title: "Why are savings accounts poor long-term investments?",
      answer: "Because returns are very low and often fail to beat inflation."
    },
    {
      title: "What is an emergency fund?",
      answer: "Emergency fund is money kept aside for unexpected situations like job loss or medical emergencies."
    },
    {
      title: "Why should emergency funds stay liquid?",
      answer: "Because emergencies require immediate access to cash."
    },
    {
      title: "What is term insurance?",
      answer: "Term insurance provides financial support to dependents if the insured person dies."
    },
    {
      title: "Why is health insurance important?",
      answer: "Because medical costs are increasing rapidly."
    },
    {
      title: "Why should people avoid F&O trading?",
      answer: "Because futures and options are highly risky and most retail traders lose money."
    },
    {
      title: "What is STCG tax?",
      answer: "STCG means Short-Term Capital Gains tax applied on short-duration investments."
    },
    {
      title: "What is LTCG tax?",
      answer: "LTCG means Long-Term Capital Gains tax applied on long-duration investments."
    },
    {
      title: "Why are equity investments taxed differently from FDs?",
      answer: "Because equity taxes apply mainly when investments are sold, while FD interest is taxed yearly."
    },
    {
      title: "Why do wealthy people focus on tax planning?",
      answer: "Because reducing taxes legally helps increase long-term wealth."
    },
    {
      title: "What did Warren Buffett mean by 'Never lose money'?",
      answer: "It means protecting capital is more important than chasing high returns."
    },
    {
      title: "What is margin of safety?",
      answer: "Margin of safety means buying investments at a price lower than their actual value."
    },
    {
      title: "Why should investors think like business owners?",
      answer: "Because stocks represent ownership in real businesses."
    },
    {
      title: "Why should investors avoid blindly following media?",
      answer: "Because media often focuses on hype, fear, and sensational news."
    },
    {
      title: "Why is personal growth considered the best investment?",
      answer: "Because skills, education, communication, and knowledge increase earning ability permanently."
    },
    {
      title: "What are the three financial buckets?",
      answer: "Bucket 1 = Emergency money\nBucket 2 = Medium-term money\nBucket 3 = Long-term wealth creation"
    },
    {
      title: "Which investments are suitable for Bucket 1?",
      answer: "Savings accounts, auto sweep FDs, and liquid funds."
    },
    {
      title: "Which investments are suitable for Bucket 2?",
      answer: "FDs, ultra-short funds, and short-term debt funds."
    },
    {
      title: "Which investments are suitable for Bucket 3?",
      answer: "Equity and real estate."
    },
    {
      title: "Why is earning ability more important than investing initially?",
      answer: "Because larger income creates larger investment opportunities."
    },
    {
      title: "Why do specialized skills increase income?",
      answer: "Because experts in niche fields are highly valuable."
    },
    {
      title: "Why do spending habits matter in wealth creation?",
      answer: "Because uncontrolled spending prevents savings and investing."
    },
    {
      title: "Why are loans dangerous?",
      answer: "Loans create financial pressure through EMIs and interest payments."
    },
    {
      title: "Why is financial discipline important?",
      answer: "Because consistent saving and investing create long-term wealth."
    },
    {
      title: "Why should people avoid comparing lifestyles?",
      answer: "Because comparison creates unnecessary spending and financial stress."
    },
    {
      title: "Why is patience important in investing?",
      answer: "Because wealth creation takes years, not weeks or months."
    },
],

"authentication":[
  {
    title: "What is authentication?",
    answer: "Authentication is the process of verifying who a user is. Example: checking username and password during login."
  },
  {
    title: "What is authorization?",
    answer: "Authorization decides what a user is allowed to access after authentication. Example: admin can delete users but normal users cannot."
  },
  {
    title: "What is JWT?",
    answer: "JWT (JSON Web Token) is a secure token used to identify logged-in users without asking them to login again and again."
  },
  {
    title: "Why do we use JWT?",
    answer: "JWT helps maintain user login state securely between frontend and backend."
  },
  {
    title: "What is inside a JWT token?",
    answer: "A JWT usually contains user information like user id, username, role, and expiry time."
  },
  {
    title: "Example of JWT payload?",
    answer: "Example: { _id: '123', username: 'lav', role: 'user' }"
  },
  {
    title: "What is token generation?",
    answer: "Token generation means creating a JWT after successful login or signup."
  },
  {
    title: "When is token generated?",
    answer: "Token is usually generated after successful registration or login."
  },
  {
    title: "Why is token sent to frontend?",
    answer: "Frontend stores the token and sends it in future requests to prove the user is logged in."
  },
  {
    title: "Where is token stored in frontend?",
    answer: "Usually in localStorage, sessionStorage, or cookies."
  },
  {
    title: "Example of storing token?",
    answer: "localStorage.setItem('token', token)"
  },
  {
    title: "How does frontend send token?",
    answer: "Frontend sends token in request headers using Authorization field."
  },
  {
    title: "Example of Authorization header?",
    answer: "Authorization: Bearer eyJhbGcOiJIUzI1Ni..."
  },
  {
    title: "What is Bearer token?",
    answer: "Bearer means the person holding this token is considered authenticated."
  },
  {
    title: "What is Express.js?",
    answer: "Express.js is a backend framework for Node.js used to create APIs and routes easily."
  },
  {
    title: "What is Node.js?",
    answer: "Node.js is a runtime environment that allows JavaScript to run outside the browser."
  },
  {
    title: "What is a backend?",
    answer: "Backend is the server-side logic that handles authentication, databases, APIs, and business logic."
  },
  {
    title: "What is frontend?",
    answer: "Frontend is the user interface users interact with like buttons, forms, and pages."
  },
  {
    title: "What is MongoDB?",
    answer: "MongoDB is a NoSQL database used to store application data like users and messages."
  },
  {
    title: "What is Mongoose?",
    answer: "Mongoose is a library that helps Node.js interact with MongoDB easily."
  },
  {
    title: "What is a schema?",
    answer: "A schema defines the structure of data stored in MongoDB."
  },
  {
    title: "Example of schema field?",
    answer: "Example: username: { type: String, required: true }"
  },
  {
    title: "What is a model?",
    answer: "A model is a tool created from schema used to interact with MongoDB collections."
  },
  {
    title: "What is a route?",
    answer: "A route is an API endpoint that handles requests from frontend."
  },
  {
    title: "Example of route?",
    answer: "Example: router.post('/login', handler)"
  },
  {
    title: "What is router.post()?",
    answer: "router.post() handles POST requests where data is sent to server."
  },
  {
    title: "What is router.get()?",
    answer: "router.get() handles GET requests used for fetching data."
  },
  {
    title: "What is req object?",
    answer: "req contains all information coming from frontend like body, params, headers, and query."
  },
  {
    title: "What is res object?",
    answer: "res is used to send response back to frontend."
  },
  {
    title: "What is req.body?",
    answer: "req.body contains data sent from frontend."
  },
  {
    title: "Example of req.body?",
    answer: "Example: { username: 'lav', password: '123456' }"
  },
  {
    title: "What is req.params?",
    answer: "req.params contains dynamic values from URL."
  },
  {
    title: "Example of req.params?",
    answer: "For /user/lav, req.params.username becomes 'lav'."
  },
  {
    title: "What is req.headers?",
    answer: "req.headers contains extra request information like tokens."
  },
  {
    title: "What is middleware?",
    answer: "Middleware is a function that runs before the final route handler."
  },
  {
    title: "Why middleware is important?",
    answer: "Middleware is used for authentication, validation, logging, and security."
  },
  {
    title: "What is next() in middleware?",
    answer: "next() passes control to the next middleware or route."
  },
  {
    title: "What happens if next() is not called?",
    answer: "The request gets stuck and route never executes."
  },
  {
    title: "What is bcrypt?",
    answer: "bcrypt is a library used to hash passwords securely."
  },
  {
    title: "Why not store plain passwords?",
    answer: "Plain passwords are dangerous because hackers can directly see them if database leaks."
  },
  {
    title: "What is password hashing?",
    answer: "Hashing converts password into unreadable encrypted text."
  },
  {
    title: "Example of hashed password?",
    answer: "Example: $2b$10$hshd8s8d8sh..."
  },
  {
    title: "What is bcrypt.compare()?",
    answer: "bcrypt.compare() checks whether entered password matches hashed password."
  },
  {
    title: "What is jwt.sign()?",
    answer: "jwt.sign() creates a new JWT token."
  },
  {
    title: "What is jwt.verify()?",
    answer: "jwt.verify() checks whether a token is valid or fake."
  },
  {
    title: "What happens if token is invalid?",
    answer: "Backend rejects request with unauthorized error."
  },
  {
    title: "What is process.env.JWT_SECRET?",
    answer: "It is a secret key stored in environment variables used to sign and verify JWT securely."
  },
  {
    title: "Why JWT_SECRET should be hidden?",
    answer: "If hackers know JWT secret, they can create fake tokens."
  },
  {
    title: "What is .env file?",
    answer: ".env file stores secret variables like database URLs and JWT secrets."
  },
  {
    title: "Example of .env variable?",
    answer: "JWT_SECRET=mysecretkey"
  },
  {
    title: "What is async?",
    answer: "async allows a function to work with asynchronous operations like database queries."
  },
  {
    title: "What is await?",
    answer: "await pauses code execution until async operation finishes."
  },
  {
    title: "Why database calls use await?",
    answer: "Because database operations take time and JavaScript should wait for result."
  },
  {
    title: "What is try-catch?",
    answer: "try-catch handles errors safely without crashing server."
  },
  {
    title: "What is HTTP request?",
    answer: "HTTP request is a message sent from frontend to backend."
  },
  {
    title: "What is HTTP response?",
    answer: "HTTP response is data sent back from backend to frontend."
  },
  {
    title: "What is API?",
    answer: "API is a communication bridge between frontend and backend."
  },
  {
    title: "What is REST API?",
    answer: "REST API follows standard HTTP methods like GET, POST, PUT, DELETE."
  },
  {
    title: "What is GET request?",
    answer: "GET request is used to fetch data from server."
  },
  {
    title: "What is POST request?",
    answer: "POST request sends data to server."
  },
  {
    title: "What is PUT request?",
    answer: "PUT request updates existing data."
  },
  {
    title: "What is DELETE request?",
    answer: "DELETE request removes data from database."
  },
  {
    title: "What is status code 200?",
    answer: "200 means request was successful."
  },
  {
    title: "What is status code 201?",
    answer: "201 means new resource was successfully created."
  },
  {
    title: "What is status code 400?",
    answer: "400 means bad request due to invalid or missing data."
  },
  {
    title: "What is status code 401?",
    answer: "401 means unauthorized access."
  },
  {
    title: "What is status code 404?",
    answer: "404 means requested resource not found."
  },
  {
    title: "What is status code 500?",
    answer: "500 means internal server error."
  },
  {
    title: "What is localStorage?",
    answer: "localStorage is browser storage used to save data permanently on frontend."
  },
  {
    title: "Why localStorage is used in authentication?",
    answer: "It stores JWT token so user stays logged in after page refresh."
  },
  {
    title: "What is cookies storage?",
    answer: "Cookies are small browser storage used for sessions and authentication."
  },
  {
    title: "What is protected route?",
    answer: "Protected route can only be accessed by authenticated users."
  },
  {
    title: "Example of protected route?",
    answer: "Example: /profile, /dashboard, /messages"
  },
  {
    title: "What is role-based authentication?",
    answer: "Role-based authentication gives permissions based on user role like admin or user."
  },
  {
    title: "Example of admin role?",
    answer: "Admin can manage users, delete posts, and access admin dashboard."
  },
  {
    title: "What is route handler?",
    answer: "Route handler is the function executed when a route is accessed."
  },
  {
    title: "What is JSON?",
    answer: "JSON is a lightweight data format used to exchange data between frontend and backend."
  },
  {
    title: "Example of JSON?",
    answer: "Example: { name: 'Lav', age: 20 }"
  },
  {
    title: "What is Axios?",
    answer: "Axios is a library used by frontend to send HTTP requests."
  },
  {
    title: "Example of axios request?",
    answer: "axios.post('/login', { username, password })"
  },
  {
    title: "What happens after successful login?",
    answer: "Backend sends token, frontend stores it, and user gets authenticated access."
  },
  {
    title: "What happens after logout?",
    answer: "Frontend removes token so user is no longer authenticated."
  },
  {
    title: "Example logout code?",
    answer: "localStorage.removeItem('token')"
  },
  {
    title: "Why token expiry is important?",
    answer: "Token expiry improves security by limiting how long stolen tokens work."
  },
  {
    title: "What does expiresIn: '7d' mean?",
    answer: "It means token becomes invalid after 7 days."
  },
  {
    title: "What is full authentication flow?",
    answer: "User logs in → backend verifies credentials → JWT generated → frontend stores token → frontend sends token in protected requests → backend verifies token → access granted."
  },
],
"analytics":[
    {
      title: "What is Data Analytics?",
      answer: "Data Analytics means studying data to find useful information and make better decisions. Real life example: A shopkeeper checks which chips sell the most and orders more of them."
    },
  
    {
      title: "Why is Data Analytics important?",
      answer: "It helps businesses understand customers, improve sales, reduce loss, and make smart decisions. Example: Netflix recommends movies based on what people watch."
    },
  
    {
      title: "What is Power BI?",
      answer: "Power BI is a tool used to convert raw data into beautiful charts and dashboards. Example: Instead of reading thousands of rows in Excel, you can see colorful graphs."
    },
  
    {
      title: "Why do companies use Power BI?",
      answer: "Companies use Power BI to quickly understand data and make decisions. Example: A company can track sales, profit, and employee performance in one dashboard."
    },
  
    {
      title: "What is a dashboard in Power BI?",
      answer: "A dashboard is a screen containing charts, KPIs, and reports together. Example: Like a car dashboard shows speed, fuel, and engine info in one place."
    },
  
    {
      title: "What is raw data?",
      answer: "Raw data is unorganized data collected directly from sources. Example: A shop’s daily sales records before cleaning."
    },
  
    {
      title: "Why is data cleaning important?",
      answer: "Dirty data gives wrong results. Cleaning removes errors and duplicates. Example: If one customer name appears 3 times by mistake, sales reports become incorrect."
    },
  
    {
      title: "What is Power Query?",
      answer: "Power Query is a tool in Power BI used for cleaning and transforming data. Example: Removing empty rows or fixing wrong spellings automatically."
    },
  
    {
      title: "What is data transformation?",
      answer: "Data transformation means changing data into a better format for analysis. Example: Changing date format from 01-01-2025 to January 1, 2025."
    },
  
    {
      title: "What are duplicates in data?",
      answer: "Duplicate data means same data repeated multiple times. Example: Same employee entered twice in employee table."
    },
  
    {
      title: "What are null values?",
      answer: "Null values mean missing data. Example: Customer phone number column is empty."
    },
  
    {
      title: "What is DAX in Power BI?",
      answer: "DAX stands for Data Analysis Expressions. It is used to create calculations and formulas in Power BI. Example: Calculating total sales or average salary."
    },
  
    {
      title: "What is a measure in Power BI?",
      answer: "A measure is a calculation used in reports. Example: Total Sales = Sum of all sales values."
    },
  
    {
      title: "What is a calculated column?",
      answer: "A calculated column creates new values row by row. Example: Profit = Selling Price - Cost Price."
    },
  
    {
      title: "What is data modeling?",
      answer: "Data modeling means connecting different tables using relationships. Example: Connecting customer table with order table using Customer ID."
    },
  
    {
      title: "What is a relationship in Power BI?",
      answer: "A relationship connects tables together. Example: Student ID connects student table with marks table."
    },
  
    {
      title: "What is a primary key?",
      answer: "A primary key is a unique column used to identify each row. Example: Aadhaar number for citizens."
    },
  
    {
      title: "What is a foreign key?",
      answer: "A foreign key is a column used to connect another table. Example: Customer ID in orders table connects to customer table."
    },
  
    {
      title: "What is KPI in Power BI?",
      answer: "KPI means Key Performance Indicator. It shows important business values. Example: Total Profit, Total Sales, Customer Count."
    },
  
    {
      title: "What is data visualization?",
      answer: "Data visualization means showing data using charts and graphs. Example: Bar chart showing monthly sales."
    },
  
    {
      title: "Why are charts useful?",
      answer: "Charts help understand data quickly. Example: A line graph easily shows sales growth over months."
    },
  
    {
      title: "What is a slicer in Power BI?",
      answer: "A slicer is a filter users can click. Example: Showing only sales data for 2025."
    },
  
    {
      title: "What is SQL?",
      answer: "SQL is a language used to manage databases. Example: Searching customer data from a huge database."
    },
  
    {
      title: "Why connect SQL with Power BI?",
      answer: "Power BI imports large database data from SQL for analysis. Example: Company sales database connected directly to dashboard."
    },
  
    {
      title: "What is HR Analytics?",
      answer: "HR Analytics means analyzing employee data. Example: Finding why employees leave the company."
    },
  
    {
      title: "What is attrition in HR Analytics?",
      answer: "Attrition means employees leaving the company. Example: 20 employees resigned this year."
    },
  
    {
      title: "What is business intelligence?",
      answer: "Business Intelligence means using data to make business decisions. Example: Finding which product gives highest profit."
    },
  
    {
      title: "What is report sharing in Power BI?",
      answer: "It means sharing dashboards with others. Example: Manager shares sales dashboard with team."
    },
  
    {
      title: "What is importing data?",
      answer: "Importing data means bringing data into Power BI. Example: Uploading Excel file into Power BI."
    },
  
    {
      title: "What is exporting data?",
      answer: "Exporting means downloading reports or dashboards. Example: Saving dashboard as PDF."
    },
  
    {
      title: "What is interactive dashboard?",
      answer: "Interactive dashboard lets users click filters and charts. Example: Clicking one state to see only its sales."
    },
  
    {
      title: "What is a bar chart?",
      answer: "Bar chart compares values using bars. Example: Comparing sales of different products."
    },
  
    {
      title: "What is a line chart?",
      answer: "Line chart shows trends over time. Example: Monthly profit growth."
    },
  
    {
      title: "What is a pie chart?",
      answer: "Pie chart shows percentage distribution. Example: Market share of companies."
    },
  
    {
      title: "What is a table visual in Power BI?",
      answer: "Table visual shows data in rows and columns. Example: Employee salary table."
    },
  
    {
      title: "What is filtering in Power BI?",
      answer: "Filtering means showing only needed data. Example: Showing only female employees."
    },
  
    {
      title: "What is sorting in Power BI?",
      answer: "Sorting arranges data in order. Example: Highest sales first."
    },
  
    {
      title: "What is drill down in Power BI?",
      answer: "Drill down means going from summary to detailed data. Example: Yearly sales → Monthly sales → Daily sales."
    },
  
    {
      title: "What is ETL?",
      answer: "ETL means Extract, Transform, Load. Example: Taking data from database, cleaning it, then loading into Power BI."
    },
  
    {
      title: "What is a dataset?",
      answer: "Dataset is a collection of related data. Example: Student marks data."
    },
  
    {
      title: "What is real-time data?",
      answer: "Real-time data updates instantly. Example: Live stock market prices."
    },
  
    {
      title: "What is business insight?",
      answer: "Insight is useful understanding from data. Example: Sales increase during festivals."
    },
  
    {
      title: "What is trend analysis?",
      answer: "Trend analysis studies patterns over time. Example: Company profits increasing every year."
    },
  
    {
      title: "What is forecasting?",
      answer: "Forecasting predicts future values using old data. Example: Predicting next month's sales."
    },
  
    {
      title: "What is customer analytics?",
      answer: "Customer analytics studies customer behavior. Example: Finding what products customers buy most."
    },
  
    {
      title: "What is sales analytics?",
      answer: "Sales analytics studies sales performance. Example: Finding best-selling products."
    },
  
    {
      title: "What is profit analysis?",
      answer: "Profit analysis checks earnings after expenses. Example: Calculating actual profit from product sales."
    },
  
    {
      title: "What is a dashboard KPI card?",
      answer: "KPI card shows important numbers clearly. Example: Total Sales = ₹5,00,000."
    },
  
    {
      title: "What is data refresh in Power BI?",
      answer: "Data refresh updates dashboard with latest data. Example: Today's sales automatically added."
    },
  
    {
      title: "What is cloud sharing in Power BI?",
      answer: "Cloud sharing means reports can be viewed online anywhere. Example: Manager checks dashboard from mobile."
    },
  
    {
      title: "What is a business report?",
      answer: "Business report shows company performance using data. Example: Monthly sales report."
    },
  
    {
      title: "What is dashboard design?",
      answer: "Dashboard design means arranging visuals properly to make reports easy to understand."
    },
  
    {
      title: "What is data-driven decision making?",
      answer: "Making decisions based on data instead of guessing. Example: Increasing production of high-selling products."
    },
  
    {
      title: "What is an analytics project?",
      answer: "An analytics project solves business problems using data. Example: Finding reasons for low sales."
    },
  
    {
      title: "What is the complete data analytics flow?",
      answer: "Collect data → clean data → analyze data → create charts/dashboard → find insights → make decisions. Example: Company studies customer buying behavior to increase sales."
    },
],
"quant":[
    {
      title: "What is data analytics?",
      answer: "Data analytics means studying data to find useful information and make better decisions. Example: A shop studies which products customers buy most so they can keep more stock of those products."
    },
  
    {
      title: "What is the complete data analytics flow?",
      answer: "Collect data → clean data → analyze data → create charts/dashboard → find insights → make decisions. Example: Company studies customer buying behavior to increase sales."
    },
  
    {
      title: "What is data?",
      answer: "Data is raw information. Example: Student marks, customer names, stock prices, mobile numbers, website clicks etc."
    },
  
    {
      title: "What is raw data?",
      answer: "Raw data is unprocessed data directly collected from source. Example: A messy Excel sheet with missing values and duplicates."
    },
  
    {
      title: "What is structured data?",
      answer: "Structured data is organized in rows and columns. Example: Excel tables or SQL databases."
    },
  
    {
      title: "What is unstructured data?",
      answer: "Unstructured data has no fixed format. Example: Videos, images, social media posts, audio files."
    },
  
    {
      title: "What is data cleaning?",
      answer: "Data cleaning means fixing messy data by removing duplicates, handling missing values, correcting errors etc. Example: Removing repeated customer entries from Excel."
    },
  
    {
      title: "Why is data cleaning important?",
      answer: "Bad data gives wrong analysis. Clean data gives correct results. Example: If customer age is entered as 500 years accidentally, analysis becomes wrong."
    },
  
    {
      title: "What are missing values?",
      answer: "Missing values mean some data is empty or unavailable. Example: A customer forgot to enter phone number in form."
    },
  
    {
      title: "How are missing values handled?",
      answer: "We can remove rows, replace with average/median, or use previous values. Example: Filling missing student marks with class average."
    },
  
    {
      title: "What are duplicates in data?",
      answer: "Duplicate data means same record appears multiple times. Example: Same customer entered twice in database."
    },
  
    {
      title: "What is exploratory data analysis (EDA)?",
      answer: "EDA means understanding data using graphs and statistics before building models. Example: Checking which products sell most in different months."
    },
  
    {
      title: "What is data visualization?",
      answer: "Data visualization means showing data using charts and graphs so people can understand easily."
    },
  
    {
      title: "Why are charts important?",
      answer: "Charts help humans quickly understand trends and patterns. Example: A sales graph quickly shows which month had highest sales."
    },
  
    {
      title: "What is a dashboard?",
      answer: "Dashboard is a screen containing charts, KPIs, filters and reports together. Example: Company dashboard showing total sales, profit and customers."
    },
  
    {
      title: "What is KPI?",
      answer: "KPI means Key Performance Indicator. It measures important business performance. Example: Monthly sales, customer growth, profit percentage."
    },
  
    {
      title: "What is insight in data analytics?",
      answer: "Insight is a useful conclusion found from data. Example: Customers buy more ice cream during summer."
    },
  
    {
      title: "What is decision making in analytics?",
      answer: "Using insights to take business actions. Example: Increasing ice cream production during summer."
    },
  
    {
      title: "What is stock?",
      answer: "A stock represents ownership in a company. Example: Buying Reliance stock means owning a very tiny part of Reliance company."
    },
  
    {
      title: "Why do stock prices change?",
      answer: "Stock prices change because of buying and selling demand. More buyers increase price, more sellers decrease price."
    },
  
    {
      title: "What is stock market?",
      answer: "Stock market is a place where people buy and sell company shares."
    },
  
    {
      title: "What is trading volume?",
      answer: "Volume means how many shares were traded. High volume means lots of people are interested in that stock."
    },
  
    {
      title: "What is a hedge fund?",
      answer: "A hedge fund is a company that tries to earn money using advanced investing strategies and data analysis."
    },
  
    {
      title: "What is quantitative finance?",
      answer: "Quantitative finance means using math, statistics, coding and data to make investment decisions."
    },
  
    {
      title: "What is WorldQuant?",
      answer: "WorldQuant is a quantitative investment company where researchers create mathematical trading signals called alphas."
    },
  
    {
      title: "What is WorldQuant Brain?",
      answer: "WorldQuant Brain is a platform where researchers create and test alpha ideas using financial data."
    },
  
    {
      title: "What is an alpha?",
      answer: "Alpha is a mathematical prediction signal used to predict future stock movement."
    },
  
    {
      title: "What is the simplest meaning of alpha?",
      answer: "Alpha is simply a smart prediction rule. Example: Stocks with high volume today may rise tomorrow."
    },
  
    {
      title: "Why are alphas created?",
      answer: "Alphas are created to predict which stocks may perform better or worse in future."
    },
  
    {
      title: "How is an alpha created?",
      answer: "Observe market pattern → create idea → convert into formula → test on historical data → improve signal → submit alpha."
    },
  
    {
      title: "What is the first step in alpha creation?",
      answer: "Observation. Researchers first observe market behavior and patterns."
    },
  
    {
      title: "What is hypothesis in alpha creation?",
      answer: "Hypothesis is the prediction idea. Example: Stocks with high momentum may continue rising."
    },
  
    {
      title: "What is momentum alpha?",
      answer: "Momentum alpha assumes stocks rising strongly may continue rising."
    },
  
    {
      title: "What is mean reversion alpha?",
      answer: "Mean reversion alpha assumes stocks moving too much in one direction may come back toward normal."
    },
  
    {
      title: "What is valuation alpha?",
      answer: "Valuation alpha uses company value information like PE ratio or undervaluation to predict future performance."
    },
  
    {
      title: "What is volume alpha?",
      answer: "Volume alpha uses unusual trading activity to predict stock movement."
    },
  
    {
      title: "What is sentiment alpha?",
      answer: "Sentiment alpha uses news, tweets or public opinion to predict stock movement."
    },
  
    {
      title: "What is fundamental alpha?",
      answer: "Fundamental alpha uses company financial data like revenue, profit and debt."
    },
  
    {
      title: "What is statistical alpha?",
      answer: "Statistical alpha uses mathematical relationships and historical patterns between stocks."
    },
  
    {
      title: "Are alpha ideas limited or infinite?",
      answer: "Alpha ideas are almost infinite because markets, human behavior and data patterns are endless. Researchers continuously combine different ideas, features and operators to create new alphas."
    },
  
    {
      title: "Why can infinite alphas be created?",
      answer: "Because researchers can combine different datasets, mathematical operators, time periods and market behaviors in countless ways."
    },
  
    {
      title: "What is operator in alpha creation?",
      answer: "Operators are functions used to manipulate data. Example: rank(), ts_mean(), ts_rank(), ts_sum()."
    },
  
    {
      title: "What is ts_mean?",
      answer: "ts_mean means time-series average. Example: Average stock price over last 20 days."
    },
  
    {
      title: "What is rank() in alpha?",
      answer: "rank() compares stocks and assigns relative positions from weakest to strongest."
    },
  
    {
      title: "Why is rank used?",
      answer: "Rank normalizes data and makes stock comparison easier."
    },
  
    {
      title: "What is backtesting?",
      answer: "Backtesting means checking whether alpha would have worked on old historical data."
    },
  
    {
      title: "Why is backtesting important?",
      answer: "Backtesting helps researchers know whether their alpha idea actually worked in past markets."
    },
  
    {
      title: "What happens after backtesting?",
      answer: "Researchers analyze performance metrics like Sharpe ratio, turnover and returns."
    },
  
    {
      title: "What is Sharpe ratio?",
      answer: "Sharpe ratio measures how good returns are compared to risk. Higher Sharpe means better and more stable performance."
    },
  
    {
      title: "Why is Sharpe ratio important?",
      answer: "Because companies want good profits with lower risk and stable performance."
    },
  
    {
      title: "What is turnover?",
      answer: "Turnover means how frequently stocks are bought and sold."
    },
  
    {
      title: "Why is high turnover bad?",
      answer: "High turnover causes excessive trading costs and unstable strategies."
    },
  
    {
      title: "What is decay in alpha?",
      answer: "Decay smooths the alpha signal so trading decisions do not change too quickly."
    },
  
    {
      title: "What is neutralization?",
      answer: "Neutralization removes unwanted bias like sector effects from alpha."
    },
  
    {
      title: "Why is sector neutralization important?",
      answer: "Because sometimes entire sectors move together, creating fake alpha signals."
    },
  
    {
      title: "What is universe in WorldQuant?",
      answer: "Universe means the group of stocks being analyzed. Example: Top 3000 US stocks."
    },
  
    {
      title: "What is delay in alpha?",
      answer: "Delay means when trades are executed after signal generation. Delay 1 means signal today, trade tomorrow."
    },
  
    {
      title: "What is long position?",
      answer: "Long means buying stock expecting price to rise."
    },
  
    {
      title: "What is short position?",
      answer: "Short means betting stock price will fall."
    },
  
    {
      title: "What is market neutral strategy?",
      answer: "Market neutral strategy balances long and short positions to reduce overall market risk."
    },
  
    {
      title: "What is overfitting?",
      answer: "Overfitting means alpha works perfectly on old data but fails on future unseen data."
    },
  
    {
      title: "Why is overfitting dangerous?",
      answer: "Because the alpha looks good in testing but loses money in real market."
    },
  
    {
      title: "What is correlation between alphas?",
      answer: "Correlation measures how similarly two alphas behave."
    },
  
    {
      title: "Why is low correlation important?",
      answer: "Low correlation means alpha is unique and adds new predictive power."
    },
  
    {
      title: "What is feature engineering?",
      answer: "Feature engineering means creating useful variables from raw data."
    },
  
    {
      title: "Example of feature engineering?",
      answer: "Converting raw volume into volume divided by average volume."
    },
  
    {
      title: "What does a research consultant at WorldQuant do?",
      answer: "Research consultants study market data, create alpha ideas, test them using historical data and improve prediction signals."
    },
  
    {
      title: "What skills are needed for WorldQuant research roles?",
      answer: "Data analysis, logical thinking, statistics, probability, coding, market understanding and problem solving."
    },
  
    {
      title: "What can interviewers ask about alpha creation?",
      answer: "They may ask how you generated ideas, tested signals, handled risk, reduced turnover and evaluated performance."
    },
  
    {
      title: "How should I explain alpha creation in interview?",
      answer: "Say: I observed patterns in stock data, formed a hypothesis, converted it into mathematical signals and tested it using historical data."
    },
  
    {
      title: "What is a simple alpha example?",
      answer: "rank(volume / ts_mean(volume,20)). It identifies stocks with unusually high trading volume compared to their normal volume."
    },
  
    {
      title: "What does this simple alpha mean?",
      answer: "Stocks with much higher trading activity than usual may experience strong future movement."
    },
  
    {
      title: "Why do quants use mathematical formulas?",
      answer: "Computers cannot understand human language, so ideas must be converted into mathematical formulas."
    },
  
    {
      title: "What is signal in quantitative trading?",
      answer: "Signal is another word for alpha or prediction indicator."
    },
  
    {
      title: "What is stock return?",
      answer: "Return means how much stock price increased or decreased over time."
    },
  
    {
      title: "What is volatility?",
      answer: "Volatility measures how much stock prices move up and down."
    },
  
    {
      title: "Why is volatility important?",
      answer: "High volatility means higher uncertainty and risk."
    },
  
    {
      title: "What is prediction in quantitative finance?",
      answer: "Prediction means estimating which stocks may perform better or worse in future."
    },
  
    {
      title: "Do alphas predict exact future prices?",
      answer: "Usually no. Most alphas predict relative performance between stocks."
    },
  
    {
      title: "What does relative performance mean?",
      answer: "It means predicting which stock may perform better than others."
    },
  
    {
      title: "Why do companies hire quant researchers?",
      answer: "Because good prediction signals can help companies make profitable trading decisions."
    },
  
    {
      title: "What is data-driven decision making?",
      answer: "Making decisions using data analysis instead of guessing."
    },
  
    {
      title: "Real life example of data-driven decisions?",
      answer: "Netflix recommending movies based on watching history."
    },
  
    {
      title: "What is machine learning in finance?",
      answer: "Machine learning uses algorithms to learn patterns from financial data automatically."
    },
  
    {
      title: "Can machine learning create alphas?",
      answer: "Yes, machine learning models can discover complex predictive patterns in stock data."
    },
  
    {
      title: "Why are financial markets difficult to predict?",
      answer: "Because markets are influenced by millions of people, news, emotions and economic events."
    },
  
    {
      title: "What makes a good alpha?",
      answer: "Good alpha has stable returns, high Sharpe ratio, low turnover and low correlation with existing strategies."
    },
  
    {
      title: "What happens if alpha stops working?",
      answer: "Researchers modify, improve or replace it with new alpha ideas."
    },
  
    {
      title: "Why do alpha signals stop working?",
      answer: "Because markets continuously change and other traders may discover similar strategies."
    },
  
    {
      title: "What is the core idea behind quantitative research?",
      answer: "Finding hidden patterns in data that may help predict future market behavior."
    }
],
"interview":[
  {
    title: "Give me your introduction.",
    answer: "Start confidently: 'I am Lav Kumar Yadav, a Civil Engineering student at IIT (ISM) Dhanbad with strong interest in Software Development and Full-Stack Engineering. I have built projects like NoteNova, Stock Trading Web App, and worked on ConvergeFi website redevelopment during my internship at Marketing Tusk. My core skills are React.js, Node.js, MongoDB, SQL, APIs, and DSA. I have solved 300+ LeetCode problems and enjoy building scalable real-world applications.'"
  },

  {
    title: "Why should we hire you?",
    answer: "Because I combine strong DSA skills, full-stack development, real-world project experience, and fast learning ability. I have already built production-level applications, worked in a startup environment, and continuously improve through coding practice and project building."
  },

  {
    title: "Explain your strongest project.",
    answer: "Start with problem → tech → features → impact. Example: 'My strongest project is NoteNova, an educational platform built using React.js, Node.js, Express.js, and MongoDB. It helps students revise using structured notes, mind maps, and premium content. I implemented JWT authentication, Razorpay payment integration, and scalable deployment using Render.'"
  },

  {
    title: "Explain complete JWT authentication flow.",
    answer: "User enters credentials → backend verifies user → JWT token generated → frontend stores token → token sent in protected requests → backend middleware verifies token → access granted."
  },

  {
    title: "Why did you use JWT instead of sessions?",
    answer: "JWT is stateless, scalable, and better for modern distributed applications. It avoids server-side session storage and works efficiently with APIs and frontend-backend separation."
  },

  {
    title: "Explain your internship at Marketing Tusk.",
    answer: "At Marketing Tusk, I worked on ConvergeFi website redevelopment planning. I analyzed website architecture, hosting, DNS setup, CMS workflows, backend form integrations, and infrastructure planning. I also assisted in scalable frontend and hosting improvements."
  },

  {
    title: "What did you learn during the internship?",
    answer: "I learned how real companies manage website infrastructure, hosting environments, CMS migration planning, DNS configuration, stakeholder requirements, and scalable web architecture."
  },

  {
    title: "What is DNS?",
    answer: "DNS converts domain names into IP addresses so browsers can connect to servers. Example: google.com gets converted into server IP."
  },

  {
    title: "What is website hosting?",
    answer: "Hosting stores website files and makes them accessible on the internet through servers."
  },

  {
    title: "What is CMS?",
    answer: "CMS (Content Management System) allows users to manage website content without writing code. Example: WordPress, Webflow."
  },

  {
    title: "Explain REST API.",
    answer: "REST API allows frontend and backend communication using HTTP methods like GET, POST, PUT, DELETE."
  },

  {
    title: "Difference between frontend and backend?",
    answer: "Frontend handles user interface and user interaction, while backend manages business logic, databases, authentication, and APIs."
  },

  {
    title: "Explain MVC architecture.",
    answer: "Model handles database logic, View handles UI, and Controller handles request-response logic between frontend and database."
  },

  {
    title: "Why did you use MongoDB?",
    answer: "MongoDB provides flexible document-based storage and works very well with JavaScript applications using Node.js."
  },

  {
    title: "Difference between SQL and MongoDB?",
    answer: "SQL stores structured relational data in tables, while MongoDB stores flexible JSON-like documents."
  },

  {
    title: "Explain your Stock Trading Web App.",
    answer: "It is a Zerodha-style simulator where users can track stock prices, manage orders, and view portfolio insights. I used React, Node.js, MongoDB, SQL, and Bootstrap to create dashboards and responsive UI."
  },

  {
    title: "What challenges did you face in Stock Trading project?",
    answer: "Managing dynamic data updates and dashboard synchronization was challenging. I solved it using proper API handling and efficient frontend state updates."
  },

  {
    title: "What is state in React?",
    answer: "State stores dynamic component data. When state changes, React automatically updates the UI."
  },

  {
    title: "Difference between props and state?",
    answer: "Props are passed from parent components and cannot be modified, while state belongs to a component and can change dynamically."
  },

  {
    title: "What is Virtual DOM?",
    answer: "Virtual DOM is a lightweight copy of the real DOM. React updates Virtual DOM first and only changes necessary parts in the real DOM for better performance."
  },

  {
    title: "What are hooks in React?",
    answer: "Hooks allow functional components to use features like state and lifecycle methods. Example: useState and useEffect."
  },

  {
    title: "Explain useEffect.",
    answer: "useEffect runs side effects like API calls, timers, or event listeners after component rendering."
  },

  {
    title: "What is middleware in Express.js?",
    answer: "Middleware runs between request and response. It is used for authentication, logging, validation, or modifying requests."
  },

  {
    title: "Explain complete request-response cycle.",
    answer: "Frontend sends request → server receives request → middleware processes it → controller executes logic → database queried → response returned to frontend."
  },

  {
    title: "What is database indexing?",
    answer: "Indexing improves query performance by helping databases quickly find required data."
  },

  {
    title: "What are joins in SQL?",
    answer: "Joins combine data from multiple tables using related columns."
  },

  {
    title: "Difference between INNER JOIN and LEFT JOIN?",
    answer: "INNER JOIN returns matching records only. LEFT JOIN returns all left table records and matching right table records."
  },

  {
    title: "Explain OOP concepts.",
    answer: "Encapsulation → bind data and methods, Inheritance → child acquires parent properties, Polymorphism → same method behaves differently, Abstraction → hiding internal implementation."
  },

  {
    title: "What is time complexity?",
    answer: "Time complexity measures how runtime grows with input size. Example: Binary Search is O(log n), Linear Search is O(n)."
  },

  {
    title: "Explain Array vs Linked List.",
    answer: "Arrays store elements continuously with fast indexing, while Linked Lists store nodes dynamically with flexible memory allocation."
  },

  {
    title: "What is stack and queue?",
    answer: "Stack follows LIFO (Last In First Out). Queue follows FIFO (First In First Out)."
  },

  {
    title: "Explain HashMap.",
    answer: "HashMap stores key-value pairs and provides average O(1) search, insert, and delete operations."
  },

  {
    title: "Why is DSA important?",
    answer: "DSA improves logical thinking, coding efficiency, optimization skills, and helps solve complex real-world problems."
  },

  {
    title: "Tell me about your LeetCode journey.",
    answer: "I solved 300+ problems covering arrays, trees, graphs, recursion, dynamic programming, and binary search. It improved my problem-solving and debugging skills."
  },

  {
    title: "Explain Git workflow.",
    answer: "Write code → git add → git commit → git push → GitHub repository updated."
  },

  {
    title: "Difference between Git and GitHub?",
    answer: "Git is a version control system. GitHub is a cloud platform for hosting Git repositories."
  },

  {
    title: "What is CI/CD?",
    answer: "CI/CD automates code testing, integration, and deployment to improve development speed and reliability."
  },

  {
    title: "What is Docker?",
    answer: "Docker packages applications with dependencies into containers so they run consistently across environments."
  },

  {
    title: "What is AWS EC2?",
    answer: "AWS EC2 provides scalable virtual servers in the cloud for hosting applications."
  },

  {
    title: "What is AWS S3?",
    answer: "AWS S3 is cloud object storage used for storing files, images, backups, and static assets."
  },

  {
    title: "Explain complete web application flow.",
    answer: "User interacts with frontend → frontend sends API request → backend processes request → database queried → response returned → frontend updates UI."
  },

  {
    title: "What happens when you type a URL in browser?",
    answer: "Browser checks cache → DNS resolves domain → browser sends HTTP request → server responds → browser renders webpage."
  },

  {
    title: "Explain HTTP vs HTTPS.",
    answer: "HTTPS is secure because it encrypts data using SSL/TLS, while HTTP transfers plain text."
  },

  {
    title: "What are your strengths?",
    answer: "Problem-solving, fast learning, consistency, teamwork, adaptability, and real-world project development."
  },

  {
    title: "What is your weakness?",
    answer: "Earlier I focused too much on perfecting details, but now I prioritize tasks better and balance quality with deadlines."
  },

  {
    title: "What motivates you?",
    answer: "Building impactful products, solving problems, learning modern technologies, and continuously improving through projects and coding."
  },

  {
    title: "Where do you see yourself in 5 years?",
    answer: "I see myself as a strong software engineer contributing to scalable systems, leading impactful projects, and continuously learning advanced technologies."
  },

  {
    title: "Why do you want to join our company?",
    answer: "Your company works on impactful technology and provides strong learning opportunities. I believe my development skills and problem-solving ability can contribute effectively while helping me grow professionally."
  },

  {
    title: "Do you have any questions for us?",
    answer: "Ask smart questions: 'What technologies does your team use most?', 'How do interns/new hires contribute to projects?', 'What learning opportunities are available?'"
  },

  {
    title: "What is the complete software development lifecycle?",
    answer: "Requirement gathering → planning → design → development → testing → deployment → maintenance."
  },

  {
    title: "What is debugging?",
    answer: "Debugging means identifying and fixing errors or unexpected behavior in code."
  },

  {
    title: "What is deployment?",
    answer: "Deployment means making an application available for users on servers or cloud platforms."
  },

  {
    title: "What is scalability?",
    answer: "Scalability means an application can handle increasing users, traffic, or data efficiently."
  },

  {
    title: "What is responsive design?",
    answer: "Responsive design ensures websites work properly on mobile, tablet, and desktop screens."
  }
],
"interviewdata":[
  {
    title: "Give me your introduction.",
    answer: "Start confidently: 'I am Lav Kumar Yadav, a Civil Engineering student at IIT (ISM) Dhanbad with strong interest in Data Analytics and Business Intelligence. I have built projects like Retail Customer Behavior Analysis, Credit Card Financial Dashboard, and Madhav E-Commerce Sales Dashboard using Python, SQL, Power BI, Tableau, and Excel. My core skills include data cleaning, visualization, SQL analysis, dashboard creation, and machine learning basics. I have solved 300+ DSA problems and enjoy converting raw data into meaningful business insights.'"
  },

  {
    title: "Why should we hire you for a Data Analyst role?",
    answer: "Because I combine analytical thinking, SQL skills, dashboard building, problem-solving ability, and real-world project experience. I can clean, analyze, and visualize business data effectively to help organizations make data-driven decisions."
  },

  {
    title: "Explain your strongest data analytics project.",
    answer: "My strongest project is Retail Customer Behavior Analysis where I used Python, SQL, and Power BI to analyze shopping trends and customer behavior. I cleaned raw transaction data using Pandas, performed EDA, extracted business insights using SQL queries, and built interactive dashboards to support business decision-making."
  },

  {
    title: "What is data cleaning?",
    answer: "Data cleaning means handling missing values, duplicates, incorrect formats, and inconsistent data to improve data quality before analysis."
  },

  {
    title: "What is EDA?",
    answer: "EDA (Exploratory Data Analysis) is the process of analyzing datasets using statistics and visualizations to identify trends, patterns, and anomalies."
  },

  {
    title: "Explain your Credit Card Financial Dashboard project.",
    answer: "I built an interactive Power BI dashboard using SQL-based customer and transaction data. I tracked KPIs, transaction trends, customer behavior, and financial insights using dynamic charts, filters, and visual reports for business analysis."
  },

  {
    title: "What challenges did you face in your dashboard projects?",
    answer: "Handling large datasets, cleaning inconsistent data, and creating efficient interactive visualizations were challenging. I solved them using proper data transformation, optimized SQL queries, and dashboard filtering techniques."
  },

  {
    title: "What is Power BI?",
    answer: "Power BI is a business intelligence and data visualization tool used to create dashboards, reports, and interactive business insights."
  },

  {
    title: "Why did you use Power BI?",
    answer: "Power BI provides powerful visualization features, interactive dashboards, real-time reporting, and easy integration with databases like SQL."
  },

  {
    title: "Explain dashboard design process.",
    answer: "First understand business requirements → clean and transform data → create KPIs and charts → add filters and interactions → optimize dashboard for readability and decision-making."
  },

  {
    title: "What are KPIs?",
    answer: "KPIs (Key Performance Indicators) are measurable values used to track business performance such as revenue, profit, sales growth, and customer retention."
  },

  {
    title: "What is SQL?",
    answer: "SQL (Structured Query Language) is used to store, retrieve, manage, and analyze relational database data."
  },

  {
    title: "Difference between WHERE and HAVING?",
    answer: "WHERE filters rows before grouping, while HAVING filters grouped data after aggregation."
  },

  {
    title: "What are joins in SQL?",
    answer: "Joins combine data from multiple tables using related columns."
  },

  {
    title: "Difference between INNER JOIN and LEFT JOIN?",
    answer: "INNER JOIN returns only matching records from both tables, while LEFT JOIN returns all records from the left table and matching records from the right table."
  },

  {
    title: "What is GROUP BY in SQL?",
    answer: "GROUP BY groups rows with similar values to perform aggregate functions like COUNT, SUM, AVG, and MAX."
  },

  {
    title: "What is normalization?",
    answer: "Normalization organizes database tables to reduce redundancy and improve data consistency."
  },

  {
    title: "What is indexing in databases?",
    answer: "Indexing improves query performance by allowing databases to quickly locate required data."
  },

  {
    title: "Explain your Madhav E-Commerce Dashboard project.",
    answer: "I designed a Power BI dashboard to analyze sales, profit, quantity, customer contribution, payment modes, and product performance. The dashboard included quarterly filters, monthly profit analysis, and category-wise insights for business tracking."
  },

  {
    title: "What is data visualization?",
    answer: "Data visualization represents data using charts, graphs, dashboards, and reports to make insights easier to understand."
  },

  {
    title: "Why is data visualization important?",
    answer: "Visualization helps businesses quickly identify patterns, trends, and insights for better decision-making."
  },

  {
    title: "What is regression?",
    answer: "Regression is a machine learning technique used to predict continuous values based on relationships between variables."
  },

  {
    title: "Difference between supervised and unsupervised learning?",
    answer: "Supervised learning uses labeled data for prediction, while unsupervised learning finds hidden patterns in unlabeled data."
  },

  {
    title: "What is clustering?",
    answer: "Clustering is an unsupervised learning technique that groups similar data points together."
  },

  {
    title: "What libraries have you used in Python for data analysis?",
    answer: "I have used Pandas for data cleaning, NumPy for numerical operations, Matplotlib/Seaborn for visualization, and Scikit-learn for machine learning basics."
  },

  {
    title: "What is Pandas?",
    answer: "Pandas is a Python library used for data cleaning, manipulation, and analysis using DataFrames."
  },

  {
    title: "What is NumPy?",
    answer: "NumPy is a Python library used for numerical and mathematical operations on arrays."
  },

  {
    title: "What is Tableau?",
    answer: "Tableau is a data visualization and BI tool used to create interactive dashboards and reports."
  },

  {
    title: "Difference between Power BI and Tableau?",
    answer: "Power BI is more cost-effective and integrates well with Microsoft tools, while Tableau is known for advanced visualizations and analytics capabilities."
  },

  {
    title: "Explain the complete data analysis process.",
    answer: "Requirement understanding → data collection → data cleaning → exploratory analysis → visualization → insight generation → reporting → decision-making."
  },

  {
    title: "What is ETL?",
    answer: "ETL stands for Extract, Transform, Load. It is the process of collecting data, cleaning/transferring it, and loading it into systems for analysis."
  },

  {
    title: "What is business intelligence?",
    answer: "Business Intelligence uses data analytics, dashboards, and reporting tools to support business decision-making."
  },

  {
    title: "What are your technical skills?",
    answer: "My technical skills include Python, SQL, Excel, Power BI, Tableau, MySQL, PostgreSQL, MongoDB, data visualization, statistical analysis, dashboard design, and machine learning basics."
  },

  {
    title: "Why is SQL important for data analysts?",
    answer: "SQL helps analysts efficiently retrieve, filter, aggregate, and analyze large datasets stored in databases."
  },

  {
    title: "What is the difference between structured and unstructured data?",
    answer: "Structured data follows a fixed format like tables, while unstructured data includes text, images, videos, and emails without fixed structure."
  },

  {
    title: "What is a primary key?",
    answer: "A primary key uniquely identifies each row in a database table."
  },

  {
    title: "What is a foreign key?",
    answer: "A foreign key links one table to another using a related column."
  },

  {
    title: "Explain Excel usage in data analysis.",
    answer: "Excel is used for data cleaning, formulas, pivot tables, charts, sorting, filtering, and quick business analysis."
  },

  {
    title: "What are pivot tables?",
    answer: "Pivot tables summarize and analyze large datasets quickly by grouping and aggregating data."
  },

  {
    title: "How do you handle missing data?",
    answer: "I handle missing data using deletion, mean/median replacement, interpolation, or business-rule-based filling depending on the dataset."
  },

  {
    title: "What motivates you in analytics?",
    answer: "I enjoy solving business problems using data and converting raw datasets into meaningful insights that support decision-making."
  },

  {
    title: "What are your strengths?",
    answer: "Analytical thinking, problem-solving, dashboard creation, fast learning, consistency, and attention to detail."
  },

  {
    title: "What is your weakness?",
    answer: "Earlier I spent extra time perfecting visual details in dashboards, but now I focus more on balancing quality and deadlines."
  },

  {
    title: "Tell me about your coding journey.",
    answer: "I solved 300+ LeetCode and Codeforces problems covering arrays, trees, graphs, dynamic programming, and algorithms, which improved my logical thinking and debugging skills."
  },

  {
    title: "Explain Git and GitHub.",
    answer: "Git is a version control system used to track code changes, while GitHub is a cloud platform for hosting Git repositories and collaboration."
  },

  {
    title: "What is report automation?",
    answer: "Report automation means generating dashboards or reports automatically using scripts or BI tools to reduce manual work."
  },

  {
    title: "What is scalability in analytics systems?",
    answer: "Scalability means systems can efficiently handle increasing amounts of data and users without performance issues."
  },

  {
    title: "Why do you want to work in Data Analytics?",
    answer: "I enjoy working with data, identifying trends, solving business problems, and helping organizations make better decisions through insights and visualization."
  },

  {
    title: "Where do you see yourself in 5 years?",
    answer: "I see myself as a skilled Data Analyst or Business Intelligence Engineer working on large-scale analytics systems and solving impactful business problems."
  },

  {
    title: "Why do you want to join our company?",
    answer: "Your company values innovation and data-driven decision-making. I believe my analytics skills, problem-solving ability, and learning mindset can contribute effectively while helping me grow professionally."
  },

  {
    title: "Do you have any questions for us?",
    answer: "Ask smart questions: 'What analytics tools does your team use most?', 'How does the company use data for decision-making?', 'What learning opportunities are available for analysts?'"
  }
],

};

export default questionsData;


