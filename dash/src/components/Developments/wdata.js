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
  title: "Complete End-to-End React Workflow Explained",
  answer: "Full React Lifecycle:\n\nDesign UI\n→ Create React Project\n→ Understand Components\n→ Write JSX\n→ Use Props & State\n→ Handle Events\n→ Manage Data Flow\n→ Connect Backend APIs\n→ Build Project\n→ Deploy Application\n\nDetailed Explanation:\n\n1. Design User Interface\n\nFirst developer plans UI structure.\n\nExample:\n- Navbar\n- Sidebar\n- Login page\n- Dashboard\n- Product cards\n- Forms\n- Buttons\n- Tables\n\nReact applications are built using reusable UI blocks called components.\n\n--------------------------------------------------\n\n2. Create React Project\n\nUsing Vite:\n\nnpm create vite@latest\n\nOR using CRA:\n\nnpx create-react-app my-app\n\nWhat happens internally:\n\n1. React project structure created.\n\n2. package.json generated.\n\n3. React dependencies installed.\n\n4. Development server configured.\n\n5. Build tools configured.\n\nNow React environment becomes ready.\n\n--------------------------------------------------\n\n3. Install Dependencies\n\nCommand:\n\nnpm install\n\nWhat happens:\n\n1. Downloads packages.\n\n2. Creates node_modules folder.\n\n3. Installs React library.\n\n4. Installs supporting tools.\n\nDependencies:\n- react\n- react-dom\n- vite\n- babel\n- eslint\n\n--------------------------------------------------\n\n4. Start React Development Server\n\nCommand:\n\nnpm run dev\n\nOR:\n\nnpm start\n\nWhat happens:\n\n1. Local server starts.\n\n2. React app compiles.\n\n3. Browser opens automatically.\n\n4. Hot reload activates.\n\nExample:\n\nhttp://localhost:5173\n\n--------------------------------------------------\n\n5. Create Components\n\nReact applications are built using components.\n\nExample:\n\nfunction Navbar() {\n  return <h1>Navbar</h1>\n}\n\nWhat happens:\n\n1. Component returns JSX.\n\n2. React converts JSX into JavaScript.\n\n3. UI renders in browser.\n\nComponents make UI reusable.\n\n--------------------------------------------------\n\n6. Use JSX\n\nJSX allows writing HTML inside JavaScript.\n\nExample:\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello React</h1>\n    </div>\n  )\n}\n\nWhat happens internally:\n\n1. Babel compiles JSX.\n\n2. JSX converts into React.createElement().\n\n3. Virtual DOM objects created.\n\n4. Browser UI updates.\n\n--------------------------------------------------\n\n7. Pass Data Using Props\n\nProps transfer data between components.\n\nExample:\n\n<Product title='Laptop' price='50000' />\n\nReceiving props:\n\nfunction Product(props) {\n  return <h1>{props.title}</h1>\n}\n\nPurpose:\n- Dynamic UI\n- Reusable components\n- Parent-child communication\n\n--------------------------------------------------\n\n8. Manage State Using useState\n\nState stores dynamic data.\n\nExample:\n\nconst [count setCount] = useState(0)\n\nWhat happens:\n\n1. React stores state.\n\n2. State updates trigger re-render.\n\n3. UI updates automatically.\n\nExample:\n\n<button onClick={() => setCount(count + 1)}>\n  Increment\n</button>\n\n--------------------------------------------------\n\n9. Handle Events\n\nReact handles user interactions.\n\nExamples:\n- Click\n- Input typing\n- Hover\n- Form submit\n\nExample:\n\n<button onClick={handleClick}>Click</button>\n\nWhat happens:\n\n1. User clicks button.\n\n2. Event handler runs.\n\n3. State updates.\n\n4. React re-renders UI.\n\n--------------------------------------------------\n\n10. Conditional Rendering\n\nReact displays UI conditionally.\n\nExample:\n\n{isLoggedIn ? <Dashboard /> : <Login />}\n\nPurpose:\n- Authentication\n- Dynamic UI\n- Permissions\n- Loading screens\n\n--------------------------------------------------\n\n11. Render Lists Using map()\n\nExample:\n\nusers.map(user => <li>{user.name}</li>)\n\nWhat happens:\n\n1. React loops through array.\n\n2. Creates UI elements.\n\n3. Efficient rendering happens.\n\nUsed for:\n- Product lists\n- Tables\n- Notifications\n- Chat apps\n\n--------------------------------------------------\n\n12. Use useEffect Hook\n\nuseEffect handles side effects.\n\nExample:\n\nuseEffect(() => {\n  fetchData()\n}, [])\n\nUsed for:\n- API calls\n- Timers\n- Authentication\n- Event listeners\n\nWhat happens:\n\n1. Component renders.\n\n2. useEffect executes.\n\n3. External tasks run.\n\n--------------------------------------------------\n\n13. Connect Backend APIs\n\nReact communicates with backend using fetch or axios.\n\nExample:\n\nfetch('http://localhost:3000/users')\n\nWhat happens:\n\n1. React sends HTTP request.\n\n2. Backend responds.\n\n3. Data stored in state.\n\n4. UI updates dynamically.\n\n--------------------------------------------------\n\n14. Routing Using React Router\n\nReact Router enables page navigation.\n\nInstall:\n\nnpm install react-router-dom\n\nExample:\n\n<Route path='/about' element={<About />} />\n\nPurpose:\n- Multi-page SPA\n- Navigation\n- Dynamic routes\n\n--------------------------------------------------\n\n15. Build React Application\n\nCommand:\n\nnpm run build\n\nWhat happens internally:\n\n1. React optimizes code.\n\n2. Minifies JavaScript.\n\n3. Compresses assets.\n\n4. Creates production-ready files.\n\nOutput folder:\n\ndist/\nOR\nbuild/\n\n--------------------------------------------------\n\n16. Deploy React Application\n\nPlatforms:\n- Vercel\n- Netlify\n- Render\n- AWS\n- Firebase\n\nDeployment flow:\n\nReact Build Files\n      ↓\nUpload to Cloud\n      ↓\nCloud serves application globally\n\n--------------------------------------------------\n\nReal World React Workflow:\n\nUI Design\n      ↓\nCreate Components\n      ↓\nManage State\n      ↓\nConnect Backend APIs\n      ↓\nHandle User Events\n      ↓\nBuild Application\n      ↓\nDeploy to Cloud\n      ↓\nUsers access application globally\n\n--------------------------------------------------\n\nMain Goal of React:\n\n- Reusable UI\n- Fast rendering\n- Dynamic applications\n- Efficient frontend development\n- Single Page Applications"
},

{
  title: "What is React?",
  answer: "React is a JavaScript library for building user interfaces.\n\nCreated by:\nMeta (Facebook)\n\nReact helps developers build:\n- Dynamic websites\n- Dashboards\n- Single Page Applications\n- Full-stack frontends\n- Mobile apps using React Native\n\nReact is component-based architecture."
},

{
  title: "Why React is Popular?",
  answer: "React is popular because:\n\n1. Reusable components.\n\n2. Fast rendering using Virtual DOM.\n\n3. Large ecosystem.\n\n4. Easy state management.\n\n5. Huge community support.\n\n6. Used by companies like:\n- Facebook\n- Instagram\n- Netflix\n- Airbnb\n- Uber"
},

{
  title: "What is SPA in React?",
  answer: "SPA means Single Page Application.\n\nIn SPA:\n- Browser loads one HTML page.\n- React updates content dynamically.\n- Full page refresh does not happen.\n\nBenefits:\n- Faster UI\n- Better user experience\n- Smooth navigation"
},

{
  title: "What is JSX?",
  answer: "JSX stands for JavaScript XML.\n\nJSX allows writing HTML-like syntax inside JavaScript.\n\nExample:\n\nfunction App() {\n  return <h1>Hello React</h1>\n}\n\nJSX is not understood directly by browser.\n\nBabel converts JSX into JavaScript."
},

{
  title: "What Happens Internally During JSX Compilation?",
  answer: "Example JSX:\n\n<h1>Hello</h1>\n\nBabel converts it into:\n\nReact.createElement('h1', null, 'Hello')\n\nThen:\n\n1. Virtual DOM object created.\n\n2. React compares changes.\n\n3. Real DOM updates efficiently."
},

{
  title: "What is Virtual DOM?",
  answer: "Virtual DOM is lightweight JavaScript copy of Real DOM.\n\nHow it works:\n\n1. React creates Virtual DOM.\n\n2. State changes occur.\n\n3. React creates new Virtual DOM.\n\n4. React compares old and new Virtual DOM.\n\n5. Only changed parts update in browser.\n\nThis process is called Diffing."
},

{
  title: "Difference Between Real DOM and Virtual DOM",
  answer: "Real DOM:\n- Actual browser DOM\n- Slow updates\n- Entire tree may re-render\n\nVirtual DOM:\n- JavaScript representation\n- Faster updates\n- Only changed parts update\n\nReact uses Virtual DOM for performance optimization."
},

{
  title: "What is a React Component?",
  answer: "Component is reusable independent UI block.\n\nExample:\n\nfunction Navbar() {\n  return <h1>Navbar</h1>\n}\n\nApplications are built by combining multiple components."
},

{
  title: "Types of Components in React",
  answer: "1. Functional Components\nModern React approach.\nUses Hooks.\n\nExample:\n\nfunction App() {\n  return <h1>Hello</h1>\n}\n\n--------------------------------------------------\n\n2. Class Components\nOlder React approach.\nUses lifecycle methods.\n\nExample:\n\nclass App extends React.Component {\n  render() {\n    return <h1>Hello</h1>\n  }\n}"
},

{
  title: "What is Props in React?",
  answer: "Props means properties.\n\nProps transfer data from parent component to child component.\n\nExample:\n\n<Product title='Phone' />\n\nReceiving:\n\nfunction Product(props) {\n  return <h1>{props.title}</h1>\n}\n\nProps are read-only."
},

{
  title: "What is State in React?",
  answer: "State stores dynamic component data.\n\nExamples:\n- Counter value\n- Form inputs\n- User login status\n- API data\n\nState changes automatically update UI."
},

{
  title: "What is useState Hook?",
  answer: "useState is React Hook used for state management.\n\nExample:\n\nconst [count setCount] = useState(0)\n\nWhere:\n- count = current state\n- setCount = updater function\n- 0 = initial value"
},

{
  title: "How Re-rendering Works in React?",
  answer: "When state or props change:\n\n1. Component function executes again.\n\n2. New Virtual DOM created.\n\n3. React compares differences.\n\n4. Browser updates only changed elements.\n\nThis makes React efficient."
},

{
  title: "What is useEffect Hook?",
  answer: "useEffect handles side effects.\n\nExample:\n\nuseEffect(() => {\n  console.log('Component Mounted')\n}, [])\n\nCommon uses:\n- API calls\n- Timers\n- Authentication\n- Event listeners"
},

{
  title: "What is Dependency Array in useEffect?",
  answer: "Dependency array controls when useEffect runs.\n\nExamples:\n\nRuns once:\n\nuseEffect(() => {}, [])\n\nRuns on every render:\n\nuseEffect(() => {})\n\nRuns when count changes:\n\nuseEffect(() => {}, [count])"
},

{
  title: "How Forms Work in React?",
  answer: "React uses controlled components.\n\nExample:\n\nconst [name setName] = useState('')\n\n<input\n  value={name}\n  onChange={(e) => setName(e.target.value)}\n/>\n\nState controls input value."
},

{
  title: "What is Controlled Component?",
  answer: "Controlled component means form input controlled by React state.\n\nBenefits:\n- Validation\n- Dynamic updates\n- Easy form handling"
},

{
  title: "How API Calls Work in React?",
  answer: "Example:\n\nuseEffect(() => {\n  fetch('https://api.example.com/users')\n    .then(res => res.json())\n    .then(data => setUsers(data))\n}, [])\n\nFlow:\n\nReact Component\n      ↓\nHTTP Request\n      ↓\nBackend API\n      ↓\nJSON Response\n      ↓\nState Update\n      ↓\nUI Re-render"
},

{
  title: "What is React Router?",
  answer: "React Router enables navigation in React SPA.\n\nInstall:\n\nnpm install react-router-dom\n\nPurpose:\n- Page navigation\n- Dynamic routes\n- Nested routes\n- Route parameters"
},

{
  title: "What is Context API?",
  answer: "Context API shares data globally.\n\nAvoids prop drilling.\n\nUseful for:\n- Authentication\n- Themes\n- User data\n- Global settings"
},

{
  title: "What is Prop Drilling?",
  answer: "Prop drilling means passing props through many intermediate components.\n\nProblem:\nParent → Child → Grandchild → Great Grandchild\n\nContext API solves this issue."
},

{
  title: "What is React Hook?",
  answer: "Hooks are special React functions.\n\nExamples:\n- useState\n- useEffect\n- useContext\n- useRef\n- useMemo\n\nHooks allow functional components to use React features."
},

{
  title: "What is useRef?",
  answer: "useRef stores mutable values without re-rendering.\n\nExample:\n\nconst inputRef = useRef()\n\nUsed for:\n- DOM access\n- Focus inputs\n- Store previous values"
},

{
  title: "What is useMemo?",
  answer: "useMemo optimizes expensive calculations.\n\nExample:\n\nconst value = useMemo(() => calculate(), [data])\n\nPurpose:\nAvoid unnecessary recalculations."
},

{
  title: "What is React Build Process?",
  answer: "Command:\n\nnpm run build\n\nWhat happens internally:\n\n1. JSX compiles.\n\n2. Files minify.\n\n3. Assets optimize.\n\n4. Production files generated.\n\nFinal files are lightweight and optimized."
},

{
  title: "Complete Real World React Flow",
  answer: "Developer creates UI components.\n\n↓\n\nProps transfer data.\n\n↓\n\nState manages dynamic values.\n\n↓\n\nEvents handle interactions.\n\n↓\n\nuseEffect handles APIs.\n\n↓\n\nReact updates Virtual DOM.\n\n↓\n\nBrowser updates UI.\n\n↓\n\nApplication builds for production.\n\n↓\n\nCloud platforms deploy globally."
}

],

  "sql-basics": [
    {
      "title": "Complete End-to-End DBMS Workflow Explained",
      "answer": "Full DBMS Workflow:\n\nUser/Application sends request\n→ DBMS receives query\n→ Query Processor parses SQL\n→ Optimizer finds best execution plan\n→ Storage Engine fetches data from disk\n→ Buffer Manager loads data into memory\n→ Transaction Manager ensures ACID properties\n→ Results returned to user\n\nStory-based Understanding:\n\nThink DBMS as a SUPER SMART Library System.\n\n- Database = Library Building\n- Tables = Bookshelves\n- Rows = Books\n- Columns = Book details (author, title)\n- SQL = Librarian language\n- DBMS = Library manager\n\n--------------------------------------------------\n\n1. User Sends Request\n\nExample:\nSELECT * FROM Students;\n\nYou are asking:\n“Give me all student records.”\n\n--------------------------------------------------\n\n2. SQL Query Reaches DBMS\n\nDBMS checks:\n- Is syntax correct?\n- Is table present?\n- Are permissions valid?\n\n--------------------------------------------------\n\n3. Query Processor Works\n\nBreaks query into steps:\n- Parse\n- Validate\n- Optimize\n\nLike librarian understanding your request.\n\n--------------------------------------------------\n\n4. Query Optimizer Finds Best Plan\n\nIf multiple ways exist to fetch data,\nDBMS chooses fastest one.\n\nExample:\nInstead of checking whole library,\nit goes directly to correct shelf.\n\n--------------------------------------------------\n\n5. Storage Engine Fetches Data\n\nData is stored in disk.\nStorage engine:\n- Reads required blocks\n- Fetches tables\n\n--------------------------------------------------\n\n6. Buffer Manager (RAM Usage)\n\nFrequently used data is stored in RAM for speed.\n\nExample:\nBooks kept on reading table instead of shelf.\n\n--------------------------------------------------\n\n7. Transaction Manager Ensures ACID\n\nACID = Safety rules of DBMS\n\nA → Atomicity (All or nothing)\nC → Consistency (Valid data only)\nI → Isolation (No interference)\nD → Durability (Saved permanently)\n\nExample:\nBank transfer:\nMoney deducted + added together safely\n\n--------------------------------------------------\n\n8. Result Returned to User\n\nFinal output sent back:\nSELECT * FROM Students → list shown\n\n==================================================\n\nBASIC DBMS CONCEPTS FLOW\n==================================================\n\n9. What is a Database?\n\nDatabase = Organized collection of data\n\nExample:\nSchool record register\n\n--------------------------------------------------\n\n10. What is DBMS?\n\nDBMS = Software that manages database\n\nExample:\nMySQL, Oracle\n\nActs like librarian managing books\n\n--------------------------------------------------\n\n11. Tables, Rows, Columns\n\nTable = Sheet\nRow = Record\nColumn = Attribute\n\nExample:\nStudent Table:\nID | Name | Age\n\n--------------------------------------------------\n\n12. Keys Concept (Identity System)\n\nPrimary Key → Unique ID\nForeign Key → Link between tables\n\nExample:\nStudent ID connects Student → Marks table\n\n--------------------------------------------------\n\n13. ER Diagram (Blueprint Stage)\n\nER Diagram = Design before database\n\nExample:\nStudent → Enrolls → Course\n\nLike planning city before building it\n\n--------------------------------------------------\n\n14. Relationships\n\n- 1:1 → One person one passport\n- 1:M → One teacher many students\n- M:M → Students & courses\n\n--------------------------------------------------\n\n15. Normalization (Data Cleaning Process)\n\nGoal: Remove duplication\n\n1NF → Atomic values\n2NF → No partial dependency\n3NF → No transitive dependency\nBCNF → Strong version of 3NF\n\nExample:\nAvoid repeating same student address again and again\n\n--------------------------------------------------\n\n16. SQL Language\n\nSQL = Language to talk with DBMS\n\nExample:\nSELECT * FROM users;\n\n--------------------------------------------------\n\n17. DDL vs DML\n\nDDL → Structure (CREATE, DROP)\nDML → Data (INSERT, UPDATE)\n\nExample:\nCreating table vs adding data\n\n--------------------------------------------------\n\n18. SQL Query Flow\n\nSELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY\n\nExample:\nFirst filter → then group → then sort\n\n--------------------------------------------------\n\n19. WHERE Clause\n\nFilters rows before processing\n\nExample:\nSELECT * FROM students WHERE age > 18;\n\n--------------------------------------------------\n\n20. GROUP BY + HAVING\n\nGROUP BY → forms groups\nHAVING → filters groups\n\nExample:\nFind departments with salary > 50000\n\n--------------------------------------------------\n\n21. JOINS (Table Connection System)\n\nINNER JOIN → matching data only\nLEFT JOIN → all left table data\nRIGHT JOIN → all right table data\nFULL JOIN → all data\n\nExample:\nStudent table + Marks table merged\n\n--------------------------------------------------\n\n22. Indexing (Fast Search System)\n\nIndex = shortcut to data\n\nExample:\nLike book index page instead of reading full book\n\n--------------------------------------------------\n\n23. Transactions (Safe Execution System)\n\nExample:\nBank transfer\n\nStep 1: deduct money\nStep 2: add money\n\nIf one fails → rollback\n\n--------------------------------------------------\n\n24. ACID Properties\n\nAtomicity → all or nothing\nConsistency → valid state always\nIsolation → no interference\nDurability → permanent storage\n\n--------------------------------------------------\n\n25. Keys System\n\nPrimary Key → unique identity\nForeign Key → relation link\nCandidate Key → possible unique keys\nComposite Key → multiple columns key\n\n--------------------------------------------------\n\n26. SQL Commands Flow\n\nCREATE → INSERT → SELECT → UPDATE → DELETE\n\nLifecycle of data\n\n--------------------------------------------------\n\n27. Storage & Execution Flow\n\nSQL → DBMS → Disk → RAM → CPU → Result\n\nLike ordering food:\nYou → waiter → kitchen → food delivered\n\n--------------------------------------------------\n\n28. Final Mental Model of DBMS\n\nDBMS = Intelligent Data Manager\n\nIt ensures:\n- Fast access\n- Safe storage\n- No duplication\n- Multi-user control\n- Crash safety\n\n--------------------------------------------------\n\nMAIN IDEA:\n\nDBMS = Brain of data systems that stores, protects, and retrieves data efficiently like a super intelligent librarian managing a huge digital library."
    },
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
      "title": "Complete End-to-End Computer Networking Workflow Explained",
      "answer": "Full Networking Workflow:\n\nUser Device\n→ Connects to Network (WiFi/LAN)\n→ Gets IP via DHCP\n→ MAC Address Used for Local Delivery\n→ DNS Resolves Domain Name\n→ TCP/UDP Connection Established\n→ Data Split into Packets\n→ Routed via Routers (Network Layer)\n→ Frames handled by Data Link Layer\n→ Bits transmitted via Physical Layer\n→ Server Processes Request\n→ Response Travels Back Same Path\n→ Webpage/App Loads on Screen\n\nDetailed Story-Based Explanation:\n\nImagine networking as a global POST OFFICE system.\n\nInside network world:\n- Devices = Houses\n- IP Address = House address\n- MAC Address = Door identity\n- Router = Post office hub\n- ISP = Country postal system\n- Packets = Letters\n- DNS = Phonebook of internet\n\n--------------------------------------------------\n\n1. User Connects to Network\n\nExample:\n- WiFi at home\n- Mobile hotspot\n- LAN cable in office\n\nDevice joins a network first.\n\n--------------------------------------------------\n\n2. DHCP Assigns IP Address\n\nDHCP automatically gives IP.\n\nExample:\nYour phone gets:\n192.168.1.5\n\nWithout IP → device cannot communicate.\n\n--------------------------------------------------\n\n3. MAC Address Identifies Device\n\nMAC = permanent hardware ID.\n\nExample:\n00:1A:2B:3C:4D:5E\n\nUsed inside local network only.\n\n--------------------------------------------------\n\n4. DNS Resolves Domain Name\n\nHuman name → IP address\n\nExample:\ngoogle.com → 142.250.182.206\n\nDNS acts like internet phonebook.\n\n--------------------------------------------------\n\n5. URL Request Starts\n\nWhen you type:\nhttps://google.com\n\nBrowser prepares request:\n- Protocol = HTTP/HTTPS\n- Target server = Google\n\n--------------------------------------------------\n\n6. TCP/UDP Connection Setup\n\nTCP:\nReliable connection\nUsed for websites, downloads\n\nUDP:\nFast, no guarantee\nUsed for gaming, streaming\n\n--------------------------------------------------\n\n7. Packet Creation\n\nData is broken into small packets.\n\nExample:\nBig letter → many small pages\n\nEach packet contains:\n- Source IP\n- Destination IP\n- Data\n- Sequence number\n\n--------------------------------------------------\n\n8. Network Layer (Routing Begins)\n\nRouters decide best path.\n\nExample:\nYour data may pass through:\nIndia → USA → Google server\n\nIP routing happens here.\n\n--------------------------------------------------\n\n9. Data Link Layer (Local Delivery)\n\nUses MAC address.\n\nEnsures:\n- Frame creation\n- Error detection\n- Node-to-node delivery\n\nExample:\nLaptop → WiFi router communication\n\n--------------------------------------------------\n\n10. Physical Layer (Signal Transmission)\n\nConverts data into:\n- Electrical signals (cable)\n- Radio waves (WiFi)\n\nExample:\nInvisible signals travel through air/wires\n\n--------------------------------------------------\n\n11. Server Receives Request\n\nServer:\n- Processes request\n- Runs backend logic\n- Fetches database data\n\nExample:\nGoogle fetches search results\n\n--------------------------------------------------\n\n12. Response Sent Back\n\nSame reverse path:\nServer → Internet → Router → Device\n\nPackets reassembled in correct order.\n\n--------------------------------------------------\n\n13. Browser Renders Page\n\nFinal step:\n- HTML parsed\n- CSS applied\n- JavaScript executed\n\nWebpage appears on screen\n\n--------------------------------------------------\n\n14. ICMP (Network Testing)\n\nUsed for diagnostics.\n\nExample:\nping google.com\n\nChecks if server is reachable.\n\n--------------------------------------------------\n\n15. Firewall Protection\n\nFilters network traffic.\n\nExample:\nBlocks unknown hackers\nAllows trusted apps\n\n--------------------------------------------------\n\n16. IP Address Types\n\nPrivate IP:\nUsed inside network\nExample: 192.168.1.10\n\nPublic IP:\nInternet identity\nExample: 103.45.67.89\n\n--------------------------------------------------\n\n17. NAT (Network Address Translation)\n\nMany devices → One public IP\n\nExample:\nHome WiFi:\nPhone + Laptop + TV → same internet IP\n\n--------------------------------------------------\n\n18. Subnetting\n\nNetwork divided into smaller parts.\n\nExample:\nCompany:\nHR network\nIT network\nFinance network\n\nImproves security & performance\n\n--------------------------------------------------\n\n19. VPN (Secure Tunnel)\n\nCreates encrypted connection.\n\nExample:\nRemote worker connects securely to office network\n\n--------------------------------------------------\n\n20. OSI Model Summary Flow\n\nApplication Layer → User apps (browser)\nTransport Layer → TCP/UDP\nNetwork Layer → IP routing\nData Link Layer → MAC + frames\nPhysical Layer → signals\n\n--------------------------------------------------\n\n21. Real World Example (Google Search Flow)\n\nUser types google.com\n→ DNS resolves IP\n→ TCP connection starts\n→ Request sent via packets\n→ Routers forward packets\n→ Google server responds\n→ Page displayed\n\n--------------------------------------------------\n\nFinal Goal of Networking:\n\n- Device communication\n- Internet connectivity\n- Data sharing\n- Secure transmission\n- Global connectivity\n- Fast & reliable communication"
    },
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
      "title": "Complete End-to-End Object-Oriented Programming (OOP) Workflow Explained",
      "answer": "Full OOP Workflow:\n\nReal World Problem\n→ Identify Objects (Entities)\n→ Create Class Blueprint\n→ Define Attributes (Data Members)\n→ Define Methods (Functions)\n→ Create Objects from Class\n→ Objects Interact\n→ Apply Encapsulation\n→ Apply Abstraction\n→ Use Inheritance\n→ Apply Polymorphism\n→ Manage Memory via Constructors/Destructors\n→ Use Advanced Relationships (Aggregation, Composition)\n→ Build Scalable Software System\n\nDetailed Story-Based Explanation:\n\nImagine OOP as building a REAL WORLD SIMULATION SYSTEM like a game or software city.\n\nInside OOP world:\n- Class = Blueprint of building\n- Object = Actual building\n- Methods = Actions inside building\n- Attributes = Properties of building\n- Inheritance = Family tree of buildings\n- Polymorphism = Same action, different behavior\n\n--------------------------------------------------\n\n1. Real World Problem Understanding\n\nExample:\nWe want to build a system for a SCHOOL.\n\nEntities:\n- Student\n- Teacher\n- Course\n\nWe first identify real-world objects.\n\n--------------------------------------------------\n\n2. Class Creation (Blueprint Step)\n\nA class defines structure.\n\nExample:\n\nclass Car {\n  color\n  speed\n  drive()\n  brake()\n}\n\nClass is NOT real object.\nIt is only design.\n\n--------------------------------------------------\n\n3. Object Creation (Real Instance)\n\nObject is actual memory instance.\n\nExample:\n\nCar myCar = new Car();\n\nNow myCar exists in memory.\n\nEach object has its own data.\n\n--------------------------------------------------\n\n4. Attributes (Data Members)\n\nAttributes store object properties.\n\nExample:\n\nCar:\n- color = red\n- speed = 100\n\nThese define object state.\n\n--------------------------------------------------\n\n5. Methods (Behavior)\n\nMethods define actions.\n\nExample:\n\nCar:\n- drive()\n- brake()\n\nObject can perform actions.\n\n--------------------------------------------------\n\n6. Encapsulation (Data Protection Layer)\n\nEncapsulation = Data hiding + security.\n\nWe wrap data + methods inside class.\n\nExample:\n\nclass BankAccount {\n  private balance\n\n  public deposit()\n  public withdraw()\n}\n\nDirect access to balance is blocked.\n\nOnly methods control data.\n\n--------------------------------------------------\n\n7. Abstraction (Hide Complexity)\n\nUser sees only essential features.\n\nExample:\n\nCar:\n- start()\n- drive()\n\nUser does NOT see engine complexity.\n\nReal life:\nYou press accelerator → car moves\nYou don't know engine logic.\n\n--------------------------------------------------\n\n8. Inheritance (Reuse System)\n\nChild class inherits parent class.\n\nExample:\n\nAnimal → Dog\n\nDog automatically gets animal properties.\n\nTypes:\n- Single\n- Multiple\n- Multilevel\n- Hierarchical\n- Hybrid\n\n--------------------------------------------------\n\n9. Polymorphism (Many Forms)\n\nSame function behaves differently.\n\nExample:\n\nAnimal sound():\nDog → Bark\nCat → Meow\nCow → Moo\n\nTwo types:\n- Compile time (overloading)\n- Runtime (overriding)\n\n--------------------------------------------------\n\n10. Method Overloading\n\nSame function name, different parameters.\n\nExample:\n\nadd(a, b)\nadd(a, b, c)\n\nCompiler decides at compile time.\n\n--------------------------------------------------\n\n11. Method Overriding\n\nChild class changes parent method.\n\nExample:\n\nAnimal.sound()\nDog.sound() → Bark\n\nRuntime decision.\n\n--------------------------------------------------\n\n12. Constructors (Object Initialization)\n\nAutomatically called when object is created.\n\nExample:\n\nCar c = new Car();\n\nTypes:\n- Default\n- Parameterized\n- Copy constructor\n\n--------------------------------------------------\n\n13. Destructors (Cleanup Step)\n\nUsed to free memory.\n\nExample:\nWhen object is deleted → destructor runs automatically.\n\n--------------------------------------------------\n\n14. 'this' Pointer (Self Reference)\n\nRefers to current object.\n\nUsed when:\nvariable names clash.\n\nExample:\nthis.name = name\n\n--------------------------------------------------\n\n15. Friend Function (Special Access)\n\nExternal function accessing private data.\n\nExample:\nDebugging function accessing class internals.\n\n--------------------------------------------------\n\n16. Aggregation (HAS-A Relationship)\n\nOne object contains another.\n\nExample:\nLibrary HAS Books\n\nBooks can exist independently.\n\n--------------------------------------------------\n\n17. Virtual Function (Runtime Polymorphism Tool)\n\nAllows overriding behavior at runtime.\n\nExample:\nBase class pointer calls derived function.\n\n--------------------------------------------------\n\n18. Pure Virtual Function (Abstract Rule)\n\nFunction with no implementation.\n\nExample:\nvirtual void draw() = 0;\n\nForces child classes to implement it.\n\n--------------------------------------------------\n\n19. Abstract Class (Incomplete Blueprint)\n\nCannot create object.\n\nUsed only for inheritance.\n\nExample:\nShape class → Circle, Rectangle\n\n--------------------------------------------------\n\n20. Access Specifiers (Security Levels)\n\nPrivate:\nOnly inside class\n\nProtected:\nClass + child classes\n\nPublic:\nAnywhere\n\n--------------------------------------------------\n\n21. Function Overloading (Same Name, Different Input)\n\nMultiple functions same name.\n\nExample:\nprint(int)\nprint(string)\n\n--------------------------------------------------\n\n22. Operator Overloading\n\nCustom meaning for operators.\n\nExample:\n+ used for adding objects.\n\n--------------------------------------------------\n\n23. Overloading vs Overriding\n\nOverloading:\nSame function, different parameters (compile time)\n\nOverriding:\nChild modifies parent function (runtime)\n\n--------------------------------------------------\n\n24. Virtual Inheritance\n\nSolves diamond problem.\n\nEnsures single copy of base class.\n\n--------------------------------------------------\n\n25. Namespace (Code Organization System)\n\nAvoid naming conflicts.\n\nExample:\nstd::cout\n\nstd = namespace\n\n--------------------------------------------------\n\nFinal OOP Goal:\n\n- Real world modeling\n- Code reusability\n- Security (encapsulation)\n- Flexibility (polymorphism)\n- Scalability\n- Maintainability\n- Clean architecture"
    },
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
      "title": "Complete End-to-End DBMS Workflow Explained",
      "answer": "Full DBMS Workflow:\n\nUser Opens App (like Amazon / Instagram)\n→ Request Sent to Backend\n→ SQL Query Generated\n→ DBMS Receives Query\n→ Query Parsed & Optimized\n→ Indexes Checked\n→ Data Fetched from Disk/RAM\n→ Transactions Processed (ACID rules)\n→ Concurrency Controlled\n→ Result Returned to Application\n\nDetailed Story-Based Explanation:\n\nThink DBMS as a SUPER SMART LIBRARY MANAGER for huge data systems like Amazon, Swiggy, or Banking apps.\n\nInside system:\n- Database = Huge library of books (data)\n- Tables = Bookshelves\n- Rows = Individual books\n- Columns = Book details\n- DBMS = Librarian who manages everything\n\n--------------------------------------------------\n\n1. User Sends Request\n\nExample:\nUser searches: \"Best phone under 20000\"\n\nFrontend sends request to backend.\nBackend converts it into SQL query.\n\nExample SQL:\nSELECT * FROM products WHERE price < 20000;\n\n--------------------------------------------------\n\n2. DBMS Receives Query\n\nDBMS first does:\n- Syntax checking\n- Permission checking\n- Query validation\n\nIf invalid → error returned\n\n--------------------------------------------------\n\n3. Query Optimization Happens\n\nDBMS does NOT directly execute query.\n\nIt first asks:\n\"What is fastest way to get data?\"\n\nIt checks:\n- Index available or not\n- Table size\n- Best execution plan\n\nExample:\nInstead of scanning full table → use index\n\n--------------------------------------------------\n\n4. Indexing Speeds Up Search\n\nWithout index:\nDBMS checks every row (slow)\n\nWith B+ Tree index:\nDBMS jumps directly to correct location\n\nExample:\nLike finding a name in phone contacts instead of reading full book\n\n--------------------------------------------------\n\n5. Data Retrieval from Memory/Disk\n\nDBMS checks:\n- RAM (fast access)\n- Disk (slow access)\n\nIf data is in RAM → fast\nIf not → fetch from disk\n\nThis is where storage engine works\n\n--------------------------------------------------\n\n6. Transactions Start (ACID Rules)\n\nWhen operations happen:\nDBMS ensures safety using ACID:\n\nA → Atomicity (all or nothing)\nC → Consistency (valid data only)\nI → Isolation (no interference)\nD → Durability (permanent after commit)\n\nExample:\nBank transfer ₹1000\nA → deduct + add together\nC → balance never becomes invalid\nI → no conflict with other users\nD → saved permanently\n\n--------------------------------------------------\n\n7. Concurrency Control Happens\n\nMany users access DB at same time.\n\nExample:\n- User A books seat\n- User B books same seat\n\nDBMS prevents conflict using:\n- Locks\n- Isolation levels\n- Serial execution logic\n\n--------------------------------------------------\n\n8. Critical Section in DBMS\n\nShared data (like bank balance) is protected.\n\nOnly ONE transaction can modify it at a time.\n\nPrevents:\n- Race conditions\n- Data corruption\n\n--------------------------------------------------\n\n9. Commit or Rollback Decision\n\nIf everything is successful:\nCOMMIT → save permanently\n\nIf error occurs:\nROLLBACK → undo all changes\n\nExample:\nPayment failed → money not deducted\n\n--------------------------------------------------\n\n10. Result Returned to User\n\nFinal processed data is sent back:\n- Product list\n- Search results\n- User details\n\nFrontend displays it to user\n\n--------------------------------------------------\n\n11. Normalization (Data Cleaning Step)\n\nBefore storing data, DBMS removes redundancy.\n\nExample bad table:\nStudent → Course → Teacher (repeated data)\n\nProblems:\n- Duplicate data\n- Update anomaly\n- Delete anomaly\n\nFix using:\n1NF → atomic values\n2NF → remove partial dependency\n3NF → remove transitive dependency\nBCNF → stronger rule version\n\n--------------------------------------------------\n\n12. ER Model Design Phase\n\nBefore DB creation:\nWe design structure using ER Diagram\n\nEntities:\n- User\n- Product\n- Order\n\nRelationships:\n- User places Order\n- Order contains Product\n\n--------------------------------------------------\n\n13. Keys Ensure Uniqueness\n\nPrimary Key → unique ID\nForeign Key → links tables\nComposite Key → multiple columns\n\nExample:\nUserID uniquely identifies every user\n\n--------------------------------------------------\n\n14. Index Types Used\n\n- Primary Index\n- Secondary Index\n- Clustered Index\n- Non-clustered Index\n\nPurpose: faster searching\n\n--------------------------------------------------\n\n15. Storage Engine Works\n\nDBMS decides how data is physically stored:\n- files\n- pages\n- blocks\n- memory mapping\n\n--------------------------------------------------\n\n16. Deadlock in DBMS\n\nExample:\nT1 holds lock A, needs B\nT2 holds lock B, needs A\n\nBoth wait forever → DEADLOCK\n\n--------------------------------------------------\n\n17. Deadlock Handling\n\nDBMS handles via:\n- Prevention\n- Detection\n- Recovery\n- Ignoring (rare cases)\n\n--------------------------------------------------\n\n18. Locking Mechanisms\n\nShared Lock → read only\nExclusive Lock → write only\n\nPrevents simultaneous modification\n\n--------------------------------------------------\n\n19. Query Execution Pipeline\n\nSQL → Parser → Optimizer → Executor → Storage Engine → Result\n\n--------------------------------------------------\n\n20. DBMS Final Role\n\nDBMS ensures:\n- Data safety\n- Fast access\n- Multi-user support\n- Consistency\n- Backup & recovery\n- Security\n\n--------------------------------------------------\n\nMain Goal of DBMS:\n\nTo store, manage, and retrieve data efficiently while ensuring accuracy, security, and concurrency in real-world applications like Amazon, Google, Banking systems."
    },
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
      title: "Complete End-to-End Operating System Workflow Explained",
      answer: "Full Operating System Workflow:\n\nUser Starts Computer\n→ Operating System Loads into Memory\n→ Processes Created\n→ CPU Scheduling Starts\n→ Memory Allocated\n→ Threads Execute\n→ Files and Devices Managed\n→ Disk Operations Performed\n→ Process Synchronization Happens\n→ Deadlocks Handled\n→ Virtual Memory Used\n→ System Runs Smoothly\n\nDetailed Story-Based Explanation:\n\nImagine Operating System as a huge smart city manager.\n\nInside computer:\n- CPU = Brain/Workers\n- RAM = Temporary Workspace\n- Hard Disk = Warehouse\n- Processes = People doing jobs\n- Threads = Workers inside company\n- Scheduler = Traffic Police\n- OS = Entire city administration\n\n--------------------------------------------------\n\n1. User Powers On Computer\n\nWhat happens internally:\n\n1. BIOS/UEFI starts.\n\n2. Hardware checked.\n\n3. Bootloader loads Operating System.\n\n4. OS kernel enters RAM.\n\n5. System services start.\n\nNow computer becomes usable.\n\n--------------------------------------------------\n\n2. Operating System Takes Control\n\nOS now manages:\n- CPU\n- Memory\n- Files\n- Keyboard\n- Mouse\n- Disk\n- Applications\n- Internet\n\nWithout OS:\nApplications cannot communicate with hardware.\n\nOS acts as middleman between:\n\nUser ↔ Operating System ↔ Hardware\n\n--------------------------------------------------\n\n3. User Opens Applications\n\nExample:\n- Chrome\n- VS Code\n- Spotify\n- Games\n\nEach application becomes PROCESS.\n\nProcess means:\nProgram currently executing.\n\nExample:\n\nChrome.exe running = Process\nVSCode.exe running = Process\n\n--------------------------------------------------\n\n4. OS Creates Process Control Block (PCB)\n\nEvery process gets PCB.\n\nPCB stores:\n- Process ID\n- Registers\n- State\n- Memory info\n- Scheduling info\n- Open files\n\nPCB acts like Aadhaar card/passport of process.\n\nOS tracks processes using PCB.\n\n--------------------------------------------------\n\n5. CPU Scheduling Starts\n\nMany processes want CPU simultaneously.\n\nBut CPU can execute limited tasks.\n\nOS scheduler decides:\n\n'Which process should run next?'\n\nThis is Process Scheduling.\n\n--------------------------------------------------\n\n6. Scheduling Algorithms Used\n\nDifferent scheduling strategies exist.\n\nFCFS:\nFirst process arriving executes first.\n\nReal Life Example:\nTicket counter queue.\n\n--------------------------------------------------\n\nSJF:\nShortest job executes first.\n\nExample:\nSmall tasks finish quickly before bigger tasks.\n\n--------------------------------------------------\n\nRound Robin:\nEvery process gets fixed CPU time.\n\nExample:\nTeacher giving every student 2 minutes to speak.\n\n--------------------------------------------------\n\nPriority Scheduling:\nHigh priority tasks execute first.\n\nExample:\nEmergency ambulance before normal traffic.\n\n--------------------------------------------------\n\n7. Multitasking Happens\n\nExample:\n- Listening music\n- Downloading files\n- Browsing Chrome\n- Coding in VS Code\n\nCPU rapidly switches between processes.\n\nThis creates illusion:\n'Everything running simultaneously.'\n\nActually CPU switches very fast.\n\n--------------------------------------------------\n\n8. Threads Are Created\n\nInside process:\nMultiple threads can exist.\n\nExample Chrome:\n- One thread loads webpage\n- One thread handles UI\n- One thread plays video\n\nThreads share:\n- Same memory\n- Same resources\n\nBut have separate:\n- Stack\n- Registers\n- Execution flow\n\n--------------------------------------------------\n\n9. Multithreading Benefits\n\nBenefits:\n- Faster execution\n- Better responsiveness\n- Resource sharing\n- Parallel execution\n\nReal Example:\nBrowser loading images and text simultaneously.\n\n--------------------------------------------------\n\n10. Memory Management Starts\n\nRAM is limited.\n\nOS allocates memory to processes.\n\nExample:\n- Chrome gets memory\n- VS Code gets memory\n- Spotify gets memory\n\nOS ensures:\nProcesses don't overwrite each other's memory.\n\n--------------------------------------------------\n\n11. Paging Happens\n\nRAM divided into:\n- Frames\n\nProcess memory divided into:\n- Pages\n\nPages loaded into frames.\n\nBenefits:\n- Efficient memory usage\n- Reduced external fragmentation\n\nExample:\nLike storing book pages in available lockers.\n\n--------------------------------------------------\n\n12. Segmentation Happens\n\nMemory divided logically:\n- Code segment\n- Data segment\n- Stack segment\n\nExample:\nLibrary with separate sections:\n- Fiction\n- Science\n- History\n\nEach section managed independently.\n\n--------------------------------------------------\n\n13. Virtual Memory Used\n\nWhen RAM becomes full:\n\nOS moves inactive pages to disk.\n\nDisk acts as extra RAM.\n\nThis is Virtual Memory.\n\nExample:\nSmall study table.\nExtra books stored on shelf.\nNeeded books brought back when required.\n\n--------------------------------------------------\n\n14. Page Fault Occurs\n\nProcess requests page not in RAM.\n\nOS:\n1. Pauses process.\n2. Loads page from disk.\n3. Updates page table.\n4. Resumes process.\n\nThis event is Page Fault.\n\n--------------------------------------------------\n\n15. Page Replacement Algorithms Used\n\nWhen RAM full:\nOS decides which page to remove.\n\nFIFO:\nOldest page removed first.\n\nExample:\nFirst person entering bus exits first.\n\n--------------------------------------------------\n\nLRU:\nLeast recently used page removed.\n\nExample:\nBooks not touched for longest time removed from table.\n\n--------------------------------------------------\n\nOptimal:\nRemoves page not needed for longest future time.\n\nTheoretical best algorithm.\n\n--------------------------------------------------\n\n16. Belady's Anomaly\n\nSometimes increasing memory causes MORE page faults.\n\nOccurs in FIFO.\n\nVery surprising OS behavior.\n\nExample:\nMore lockers but worse arrangement causing more searching.\n\n--------------------------------------------------\n\n17. Critical Section Problem\n\nProcesses share resources.\n\nExample:\nTwo ATM transactions updating same bank account.\n\nIf both update simultaneously:\nWrong balance may occur.\n\nCritical Section:\nCode accessing shared resource.\n\nOnly one process allowed at a time.\n\n--------------------------------------------------\n\n18. Synchronization Mechanisms Used\n\nSemaphore:\nControls access count.\n\nExample:\nParking lot with 2 spaces.\nOnly 2 cars allowed.\n\n--------------------------------------------------\n\nMutex:\nSingle lock.\n\nExample:\nBathroom lock.\nOnly one person allowed.\n\n--------------------------------------------------\n\n19. Deadlock Happens\n\nExample Story:\n\nPerson A holds Pen and wants Notebook.\nPerson B holds Notebook and wants Pen.\n\nBoth wait forever.\n\nComputer equivalent:\nProcesses waiting endlessly for resources.\n\n--------------------------------------------------\n\n20. Four Conditions of Deadlock\n\n1. Mutual Exclusion\nOnly one process uses resource.\n\n2. Hold and Wait\nProcess holds one resource while waiting for another.\n\n3. No Preemption\nResources cannot be forcefully removed.\n\n4. Circular Wait\nProcesses waiting in circular chain.\n\nAll four together create deadlock.\n\n--------------------------------------------------\n\n21. Deadlock Handling Techniques\n\nPrevention:\nBreak one deadlock condition.\n\nAvoidance:\nAvoid unsafe states.\n\nDetection and Recovery:\nAllow deadlock then recover.\n\nIgnore:\nSome systems ignore rare deadlocks.\n\n--------------------------------------------------\n\n22. Banker's Algorithm\n\nOS checks:\n'If resource allocated now, will system remain safe?'\n\nExample:\nBank only giving loans if enough money remains for everyone.\n\n--------------------------------------------------\n\n23. Disk Scheduling Starts\n\nHard disk receives many requests.\n\nOS decides order of servicing.\n\nGoal:\nReduce disk head movement.\n\n--------------------------------------------------\n\n24. Disk Scheduling Algorithms\n\nFCFS:\nRequests served in order.\n\n--------------------------------------------------\n\nSSTF:\nNearest request served first.\n\nExample:\nDelivery boy visiting closest house first.\n\n--------------------------------------------------\n\nSCAN:\nDisk arm moves like elevator.\n\nServices requests while moving.\n\n--------------------------------------------------\n\nC-SCAN:\nMoves in single direction only.\n\nProvides uniform waiting time.\n\n--------------------------------------------------\n\n25. Thrashing Occurs\n\nToo many page faults.\n\nSystem spends more time swapping pages than executing.\n\nCPU utilization drops heavily.\n\nExample:\nStudent constantly exchanging books instead of studying.\n\n--------------------------------------------------\n\n26. Fragmentation Happens\n\nInternal Fragmentation:\nUnused memory inside allocated block.\n\nExample:\n100-seat hall booked for 70 people.\n\n--------------------------------------------------\n\nExternal Fragmentation:\nSmall free spaces scattered.\n\nExample:\nParking spaces available but no large enough continuous space.\n\n--------------------------------------------------\n\n27. Spooling Used\n\nPrinter example:\n\nMultiple print jobs queued.\n\nOS stores jobs temporarily.\n\nPrinter processes one-by-one.\n\nAllows multitasking during printing.\n\n--------------------------------------------------\n\n28. Starvation Happens\n\nLow priority process waits forever.\n\nExample:\nVIP customers always served before normal customers.\n\n--------------------------------------------------\n\n29. Aging Solves Starvation\n\nOS gradually increases waiting process priority.\n\nEnsures fairness.\n\nExample:\nLong waiting customer eventually gets priority.\n\n--------------------------------------------------\n\n30. Kernel Types\n\nMonolithic Kernel:\nEverything inside kernel.\n\nExamples:\nLinux\n\nFast but larger.\n\n--------------------------------------------------\n\nMicrokernel:\nOnly essential services inside kernel.\n\nExamples:\nMinix\n\nMore modular and secure.\n\n--------------------------------------------------\n\n31. RAID Storage Used\n\nMultiple disks combined.\n\nGoals:\n- Backup\n- Speed\n- Reliability\n\nExample:\nRAID 1 mirrors data on two disks.\n\nIf one fails:\nOther still contains data.\n\n--------------------------------------------------\n\n32. Logical vs Physical Address\n\nLogical Address:\nGenerated by CPU.\n\nPhysical Address:\nActual RAM location.\n\nMMU converts logical to physical addresses.\n\n--------------------------------------------------\n\n33. System Runs Continuously\n\nOS continuously manages:\n- Processes\n- CPU\n- Memory\n- Files\n- Devices\n- Networking\n- Security\n- Synchronization\n\nOperating System acts like invisible manager of entire computer.\n\n--------------------------------------------------\n\nMain Goal of Operating System:\n\n- Efficient resource management\n- Multitasking\n- Process execution\n- Memory management\n- Hardware communication\n- User convenience\n- System stability"
    },
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
      title: "What is the complete workflow of a request in an Express + MongoDB (Mongoose) application?",
      answer: "A complete request workflow in an Express + MongoDB application describes how data flows from the client (frontend) to the server (backend), gets processed, interacts with the database, and returns a response back to the client.\n\nThis is the full end-to-end cycle used in real-world MERN stack applications.\n\n---\n\n1. CLIENT SENDS REQUEST\nThe workflow starts when the frontend (React, browser, Postman, etc.) sends an HTTP request to the backend.\n\nExample:\nPOST /api/students\nBody:\n{\n  \"name\": \"Alice\",\n  \"age\": 20\n}\n\nThis request is sent using fetch or axios.\n\nExample (frontend):\naxios.post('/api/students', {\n  name: 'Alice',\n  age: 20\n});\n\n---\n\n2. EXPRESS RECEIVES REQUEST (ROUTING)\nThe Express server receives the request and matches it with the correct route.\n\nExample route:\n\napp.post('/api/students', async (req, res) => {\n  // logic here\n});\n\nAt this stage, Express identifies:\n- HTTP method: POST\n- Endpoint: /api/students\n\n---\n\n3. MIDDLEWARE EXECUTION (IF ANY)\nBefore reaching the route handler, middleware functions execute in sequence.\n\nCommon middleware:\n- express.json() → parses JSON body\n- authentication middleware → verifies token\n- logging middleware → logs request\n\nExample:\n\napp.use(express.json());\n\nMiddleware transforms incoming raw request into usable JavaScript object:\n\nreq.body = {\n  name: 'Alice',\n  age: 20\n}\n\n---\n\n4. CONTROLLER / ROUTE HANDLER EXECUTION\nNow the request reaches the controller logic.\n\nExample:\n\napp.post('/api/students', async (req, res) => {\n  const { name, age } = req.body;\n\n  const student = new Student({ name, age });\n  await student.save();\n\n  res.status(201).json(student);\n});\n\nHere:\n- Data is extracted from req.body\n- Business logic is applied\n- Mongoose model is used\n\n---\n\n5. MONGOOSE MODEL INTERACTION\nMongoose acts as a bridge between Node.js and MongoDB.\n\nExample:\n\nconst student = new Student({ name, age });\nawait student.save();\n\nInternally Mongoose:\n- Validates schema rules\n- Converts data into BSON format\n- Prepares MongoDB query\n\n---\n\n6. MONGODB DATABASE OPERATION\nMongoDB stores the document inside a collection.\n\nStructure:\nDatabase → Collection → Document\n\nExample stored document:\n{\n  _id: ObjectId('...'),\n  name: \"Alice\",\n  age: 20\n}\n\nMongoDB automatically:\n- Generates _id\n- Stores data in BSON format\n- Indexes document if required\n\n---\n\n7. RESPONSE SENT BACK TO SERVER\nAfter successful database operation, MongoDB returns result to Mongoose.\n\nThen Mongoose returns control to Express.\n\nExample response object:\n{\n  _id: \"123\",\n  name: \"Alice\",\n  age: 20\n}\n\n---\n\n8. EXPRESS SENDS RESPONSE TO CLIENT\nExpress sends final response back to frontend.\n\nExample:\n\nres.status(201).json(student);\n\nNow frontend receives data.\n\n---\n\n9. CLIENT RECEIVES RESPONSE\nFrontend processes the response.\n\nExample:\n\n.then(response => {\n  console.log(response.data);\n});\n\nUI updates automatically:\n- New student appears in list\n- State updates in React\n\n---\n\nREAL-WORLD SUMMARY FLOW\nClient → Express Route → Middleware → Controller → Mongoose Model → MongoDB → Mongoose → Express Response → Client UI Update\n\n---\n\nEXTRA IMPORTANT POINTS:\n- Middleware runs before routes\n- Mongoose validates schema before saving\n- MongoDB stores data in BSON format\n- Async/await ensures non-blocking execution\n- Errors can be caught using try/catch or error middleware\n\n---\n\nThis workflow is the backbone of every MERN stack application and is used in systems like authentication, e-commerce, dashboards, and APIs."
    },
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
  title: "Complete End-to-End Git + GitHub Workflow Explained",
  answer: "Full GitHub Lifecycle:\n\nCode\n→ Git Init\n→ Track Files\n→ Commit Changes\n→ Create Repository\n→ Connect Remote Repository\n→ Push Code to GitHub\n→ Clone Anywhere\n→ Collaborate Using Branches\n→ Deploy Projects\n\nDetailed Explanation:\n\n1. Write Application Code\n\nFirst you create your project.\n\nExample:\n- React frontend\n- Node.js backend\n- Full-stack application\n- Python project\n- Java project\n\nAt this stage project exists only on your local computer.\n\n--------------------------------------------------\n\n2. Initialize Git Repository\n\nCommand:\n\ngit init\n\nWhat happens internally:\n\n1. Git creates hidden .git folder.\n\n2. Git starts tracking project history.\n\n3. Version control becomes active.\n\nNow your project becomes Git repository.\n\n--------------------------------------------------\n\n3. Track Files Using Git\n\nCommand:\n\ngit add .\n\nWhat happens:\n\n1. Git scans project files.\n\n2. Files move to staging area.\n\n3. Git prepares files for commit.\n\nGit now knows which changes should be saved.\n\n--------------------------------------------------\n\n4. Create Commit\n\nCommand:\n\ngit commit -m 'Initial Commit'\n\nWhat happens internally:\n\n1. Git takes snapshot of project.\n\n2. Commit gets unique hash ID.\n\n3. Project history gets stored.\n\nCommit acts like save point in project timeline.\n\n--------------------------------------------------\n\n5. Create GitHub Repository\n\nGo to GitHub.\n\nCreate new repository.\n\nExample:\n\nnotenova-project\n\nGitHub provides remote repository URL.\n\nExample:\n\nhttps://github.com/username/notenova-project.git\n\n--------------------------------------------------\n\n6. Connect Local Project to GitHub\n\nCommand:\n\ngit remote add origin https://github.com/username/repository.git\n\nMeaning:\n\norigin = nickname of GitHub repository.\n\nNow local Git repository becomes connected to GitHub cloud repository.\n\n--------------------------------------------------\n\n7. Push Code to GitHub\n\nCommand:\n\ngit push -u origin main\n\nWhat happens internally:\n\n1. Git compresses commits.\n\n2. Sends commits to GitHub servers.\n\n3. GitHub stores project online.\n\n4. Repository becomes accessible globally.\n\nNow your code exists:\n- Locally\n- On GitHub cloud\n\n--------------------------------------------------\n\n8. Clone Repository Anywhere\n\nAnother user can download project.\n\nCommand:\n\ngit clone repository-link\n\nWhat happens:\n\n1. Git downloads all commits.\n\n2. Entire project history downloads.\n\n3. Local repository recreated.\n\nProject now works on:\n- Windows\n- Mac\n- Linux\n- Cloud servers\n\n--------------------------------------------------\n\n9. Collaboration Using Branches\n\nDevelopers create branches.\n\nExample:\n\ngit checkout -b feature-auth\n\nPurpose:\n- Safe development\n- Independent features\n- No damage to main branch\n\nAfter development:\nBranches merge into main.\n\n--------------------------------------------------\n\n10. Deployment Using GitHub\n\nCloud platforms connect directly to GitHub.\n\nExample:\n- Render\n- Vercel\n- Netlify\n- Railway\n- AWS\n\nDeployment flow:\n\nGitHub Repository\n      ↓\nCloud pulls latest code\n      ↓\nDependencies install\n      ↓\nApplication builds\n      ↓\nProject deployed globally\n\n--------------------------------------------------\n\nReal World GitHub Workflow:\n\nDeveloper writes code\n      ↓\nGit tracks changes\n      ↓\nCommits created\n      ↓\nCode pushed to GitHub\n      ↓\nTeam members pull code\n      ↓\nBranches created\n      ↓\nFeatures merged\n      ↓\nCloud deploys project\n\n--------------------------------------------------\n\nMain Goal of Git + GitHub:\n\n- Version control\n- Collaboration\n- Backup\n- Deployment\n- Project history\n- Team development"
},

{
  title: "What is Git?",
  answer: "Git is a distributed version control system.\n\nGit tracks:\n- File changes\n- Project history\n- Code versions\n- Team collaboration\n\nGit allows developers to:\n- Save project history\n- Restore old versions\n- Collaborate safely\n- Manage branches\n\nGit works locally on your computer."
},

{
  title: "What is GitHub?",
  answer: "GitHub is a cloud platform used to host Git repositories online.\n\nGitHub allows:\n- Code hosting\n- Collaboration\n- Deployment integration\n- Pull requests\n- Team management\n\nGitHub is like cloud storage for Git projects."
},

{
  title: "Difference Between Git and GitHub",
  answer: "Git:\n- Version control system\n- Works locally\n- Tracks history\n- Installed on computer\n\nGitHub:\n- Cloud platform\n- Hosts Git repositories online\n- Used for collaboration\n- Accessible globally\n\nGit = Technology\nGitHub = Online platform using Git"
},

{
  title: "How to Install Git?",
  answer: "Step 1:\nDownload Git.\n\nOfficial Website:\n\nhttps://git-scm.com/\n\n--------------------------------------------------\n\nStep 2:\nInstall Git.\n\nKeep default settings during installation.\n\n--------------------------------------------------\n\nStep 3:\nVerify installation.\n\nCommand:\n\ngit --version\n\nExample output:\n\ngit version 2.45.1"
},

{
  title: "How to Configure Git for First Time?",
  answer: "Git needs user identity.\n\nCommands:\n\ngit config --global user.name 'Your Name'\n\ngit config --global user.email 'your@email.com'\n\nPurpose:\nEvery commit stores:\n- Username\n- Email\n- Author information"
},

{
  title: "How to Check Git Configuration?",
  answer: "Command:\n\ngit config --list\n\nShows:\n- Username\n- Email\n- Default editor\n- Git settings"
},

{
  title: "What is a Git Repository?",
  answer: "A Git repository is a project tracked by Git.\n\nContains:\n- Files\n- Commit history\n- Branches\n- Git metadata\n\nGit repository is created using:\n\ngit init"
},

{
  title: "What Happens Internally During git init?",
  answer: "Command:\n\ngit init\n\nGit creates hidden .git folder.\n\nInside .git:\n- Commit history\n- Branch data\n- Configurations\n- Object database\n- Logs\n\nThis folder powers complete Git system."
},

{
  title: "What is Git Tracking?",
  answer: "Git tracks file changes.\n\nExample:\n- New file created\n- Existing file modified\n- File deleted\n\nGit compares changes against previous commit snapshots."
},

{
  title: "What is Git Status?",
  answer: "Command:\n\ngit status\n\nShows:\n- Untracked files\n- Modified files\n- Staged files\n- Current branch\n\nVery important Git debugging command."
},

{
  title: "Git File Lifecycle Explained",
  answer: "Git file states:\n\n1. Untracked\nGit does not know file.\n\n2. Staged\nFile ready for commit.\n\n3. Committed\nSnapshot saved in history.\n\n4. Modified\nCommitted file changed again.\n\nLifecycle:\n\nCreate File\n→ git add\n→ Staged\n→ git commit\n→ Committed\n→ Edit File\n→ Modified"
},

{
  title: "What is Staging Area in Git?",
  answer: "Staging area is temporary holding area before commit.\n\nCommand:\n\ngit add .\n\nPurpose:\nSelect which changes should go into next commit.\n\nGit does NOT commit automatically.\n\nStaging gives developer control."
},

{
  title: "What Does git add . Do?",
  answer: "Command:\n\ngit add .\n\nMeaning:\n\n1. Scans all project files.\n\n2. Adds new/modified files to staging area.\n\n3. Prepares files for commit.\n\nDot (.) means:\nCurrent folder and everything inside it."
},

{
  title: "What is a Git Commit?",
  answer: "Commit is snapshot/save point of project.\n\nCommand:\n\ngit commit -m 'message'\n\nEvery commit contains:\n- File changes\n- Timestamp\n- Author\n- Unique hash ID\n\nCommits create project history timeline."
},

{
  title: "What Happens Internally During Commit?",
  answer: "Command:\n\ngit commit -m 'Initial Commit'\n\nGit internally:\n\n1. Creates snapshot of staged files.\n\n2. Generates unique commit hash.\n\n3. Stores commit inside .git database.\n\n4. Updates project history.\n\nCommit becomes permanent history record."
},

{
  title: "What is a Branch in Git?",
  answer: "Branch is independent line of development.\n\nDefault branch:\nmain\n\nPurpose:\n- Develop features safely\n- Avoid breaking production code\n- Work independently\n\nExample:\n\nfeature-auth\nfeature-payment\nbug-fix"
},

{
  title: "How to Create New Branch?",
  answer: "Command:\n\ngit checkout -b feature-login\n\nWhat happens:\n\n1. New branch created.\n\n2. Git switches to new branch.\n\n3. Development becomes isolated from main branch."
},

{
  title: "How Branching Works Internally?",
  answer: "Git branches are lightweight pointers.\n\nExample:\n\nmain → commit A\nfeature → commit A\n\nAfter new commits:\n\nfeature → commit B\n\nmain branch remains unchanged.\n\nThis allows safe development."
},

{
  title: "What is Git Merge?",
  answer: "Merge combines branches.\n\nExample:\n\ngit merge feature-login\n\nWhat happens:\n\n1. Git combines commits.\n\n2. Feature changes move into main branch.\n\n3. Project updates with new functionality."
},

{
  title: "What is Merge Conflict?",
  answer: "Merge conflict occurs when same code lines changed in multiple branches.\n\nGit becomes confused which version to keep.\n\nDeveloper manually resolves conflict.\n\nExample conflict:\n\n<<<<<<< HEAD\nold code\n=======\nnew code\n>>>>>>> feature"
},

{
  title: "What is GitHub Repository?",
  answer: "GitHub repository is cloud-hosted Git project.\n\nContains:\n- Source code\n- Branches\n- Commits\n- Pull requests\n- Issues\n- Collaboration tools"
},

{
  title: "How to Create GitHub Repository?",
  answer: "Step 1:\nLogin to GitHub.\n\n--------------------------------------------------\n\nStep 2:\nClick:\nNew Repository\n\n--------------------------------------------------\n\nStep 3:\nEnter:\n- Repository name\n- Description\n- Public/private setting\n\n--------------------------------------------------\n\nStep 4:\nClick:\nCreate Repository"
},

{
  title: "How to Push Project to GitHub Step-by-Step?",
  answer: "Commands:\n\ncd project-folder\n\n--------------------------------------------------\n\ngit init\n\n--------------------------------------------------\n\ngit add .\n\n--------------------------------------------------\n\ngit commit -m 'Initial Commit'\n\n--------------------------------------------------\n\ngit branch -M main\n\n--------------------------------------------------\n\ngit remote add origin https://github.com/username/repository.git\n\n--------------------------------------------------\n\ngit push -u origin main\n\nNow project becomes available on GitHub."
},

{
  title: "What Does git remote add origin Mean?",
  answer: "Command:\n\ngit remote add origin repository-link\n\nMeaning:\n\nremote:\nExternal repository.\n\norigin:\nNickname for GitHub repository.\n\nNow local Git connects with GitHub repository."
},

{
  title: "What Does git push Do?",
  answer: "Command:\n\ngit push origin main\n\nWhat happens internally:\n\n1. Git compresses commits.\n\n2. Sends commits to GitHub.\n\n3. GitHub stores repository online.\n\n4. Remote repository updates."
},

{
  title: "What Does git pull Do?",
  answer: "Command:\n\ngit pull origin main\n\nWhat happens:\n\n1. Downloads latest commits.\n\n2. Updates local repository.\n\n3. Syncs local code with GitHub."
},

{
  title: "What Does git clone Do?",
  answer: "Command:\n\ngit clone repository-link\n\nWhat happens:\n\n1. Downloads repository.\n\n2. Downloads commit history.\n\n3. Creates local Git repository.\n\n4. Connects remote automatically."
},

{
  title: "What is .gitignore File?",
  answer: ".gitignore tells Git which files/folders should NOT be tracked.\n\nExample:\n\nnode_modules/\n.env\nbuild/\n\nPurpose:\n- Security\n- Reduce repository size\n- Avoid unnecessary files"
},

{
  title: "Why node_modules Should Not Be Pushed?",
  answer: "node_modules contains installed dependencies.\n\nProblems:\n- Very large size\n- OS-specific binaries\n- Easily regenerated using npm install\n\nInstead:\nPush package.json and package-lock.json."
},

{
  title: "What is Pull Request (PR)?",
  answer: "Pull Request is request to merge code into another branch.\n\nUsed in team collaboration.\n\nFlow:\n\nDeveloper creates feature branch\n      ↓\nPushes branch to GitHub\n      ↓\nCreates Pull Request\n      ↓\nTeam reviews code\n      ↓\nCode merged into main"
},

{
  title: "How Teams Collaborate Using GitHub?",
  answer: "Typical workflow:\n\n1. Clone repository.\n\n2. Create feature branch.\n\n3. Write code.\n\n4. Commit changes.\n\n5. Push branch.\n\n6. Create Pull Request.\n\n7. Team reviews code.\n\n8. Merge into main branch."
},

{
  title: "How GitHub Helps Deployment?",
  answer: "Modern cloud platforms integrate directly with GitHub.\n\nExamples:\n- Vercel\n- Netlify\n- Render\n- Railway\n- AWS\n\nDeployment Flow:\n\nPush code to GitHub\n      ↓\nCloud detects changes\n      ↓\nApplication rebuilds\n      ↓\nLatest version deployed automatically"
},

{
  title: "Difference Between GitHub Public and Private Repository",
  answer: "Public Repository:\nAnyone can see code.\n\nPrivate Repository:\nOnly authorized users can access code.\n\nUseful for:\n- Client projects\n- Company projects\n- Secure applications"
},

{
  title: "What Happens Internally During git pull?",
  answer: "git pull performs:\n\n1. git fetch\nDownloads latest commits.\n\n2. git merge\nMerges latest commits into current branch.\n\nThis updates local project."
},

{
  title: "What is Git Fetch?",
  answer: "git fetch downloads latest changes from GitHub without merging.\n\nSafe way to inspect updates before merging.\n\nExample:\n\ngit fetch origin"
},

{
  title: "How to Undo Last Commit?",
  answer: "Keep changes:\n\ngit reset HEAD~1\n\nRemove completely:\n\ngit reset --hard HEAD~1\n\nWarning:\nHard reset permanently deletes changes."
},

{
  title: "How to Remove Git Repository?",
  answer: "Delete hidden .git folder.\n\nWindows:\n\nrmdir /s /q .git\n\nLinux/Mac:\n\nrm -rf .git\n\nProject stops being Git repository."
},

{
  title: "Complete Real World GitHub Workflow",
  answer: "Developer writes code.\n\n↓\n\nGit tracks changes.\n\n↓\n\nCommits created.\n\n↓\n\nRepository connected to GitHub.\n\n↓\n\nCode pushed online.\n\n↓\n\nTeam members clone repository.\n\n↓\n\nFeature branches created.\n\n↓\n\nPull requests opened.\n\n↓\n\nCode reviewed and merged.\n\n↓\n\nCloud platforms deploy latest code.\n\n--------------------------------------------------\n\nReal World Example:\n\nDeveloper Machine\n      ↓\nGit Repository\n      ↓\nGitHub Cloud Repository\n      ↓\nTeam Collaboration\n      ↓\nCI/CD Pipeline\n      ↓\nProduction Deployment"
}

],



"backend": [

{
  title: "Complete End-to-End Backend Workflow Explained",
  answer: "Full Backend Lifecycle:\n\nFrontend Request\n→ Express Server\n→ Middleware\n→ Routes\n→ Controllers\n→ Database\n→ Authentication\n→ Response\n\nDetailed Explanation:\n\n1. Frontend Sends Request\n\nFrontend applications like React send requests to backend APIs.\n\nExample:\n\naxios.post('http://localhost:3000/login')\n\nOR:\n\nfetch('http://localhost:3000/login')\n\nFrontend sends:\n- URL\n- HTTP Method\n- Headers\n- Body Data\n\nExample:\n{\n  username: 'lav',\n  password: '123'\n}\n\n--------------------------------------------------\n\n2. Node.js Runtime Starts Backend\n\nCommand:\n\nnode index.js\n\nOR:\n\nnpm start\n\nNode.js creates:\n- Server process\n- Event loop\n- Memory allocation\n- Async execution environment\n\nBackend now becomes capable of handling requests.\n\n--------------------------------------------------\n\n3. Express Server Handles Requests\n\nExample:\n\nconst express = require('express');\nconst app = express();\n\napp.listen(3000)\n\nExpress creates:\n- HTTP server\n- Routing system\n- Middleware pipeline\n- Response handling system\n\nNow backend starts listening on:\n\nlocalhost:3000\n\n--------------------------------------------------\n\n4. Middleware Executes\n\nExample:\n\napp.use(express.json())\n\nMiddleware works before routes.\n\nPurpose:\n- Parse JSON\n- Authentication\n- Validation\n- Logging\n- Error handling\n\nMiddleware acts like security/checkpoint system.\n\n--------------------------------------------------\n\n5. Route Matches URL\n\nExample:\n\nrouter.post('/login', loginUser)\n\nBackend checks:\n- URL path\n- HTTP method\n\nIf matched:\nRequest goes to controller.\n\n--------------------------------------------------\n\n6. Controller Executes Logic\n\nExample:\n\nconst user = await User.findOne({ username })\n\nController handles:\n- Authentication\n- Validation\n- Database logic\n- Business logic\n- Response creation\n\nController is actual backend brain.\n\n--------------------------------------------------\n\n7. Database Operation Happens\n\nBackend communicates with MongoDB.\n\nExample:\n\nawait User.findOne()\n\nDatabase stores:\n- Users\n- Passwords\n- Products\n- Orders\n- Notes\n- Messages\n\nMongoDB returns data to backend.\n\n--------------------------------------------------\n\n8. JWT Authentication Happens\n\nExample:\n\nconst token = jwt.sign(...)\n\nJWT token acts like digital identity card.\n\nFrontend stores token.\n\nFuture requests send:\n\nAuthorization: Bearer TOKEN\n\nBackend verifies token.\n\n--------------------------------------------------\n\n9. Response Sent Back\n\nExample:\n\nres.json({ message: 'Login Success' })\n\nBackend sends:\n- JSON data\n- Tokens\n- User info\n- Status codes\n\nFrontend receives response.\n\n--------------------------------------------------\n\n10. Frontend Updates UI\n\nReact receives response.\n\nExample:\n- Login success\n- Dashboard opens\n- Notes load\n- Chat updates\n\nBackend request lifecycle completes.\n\n--------------------------------------------------\n\nReal World Backend Flow:\n\nReact Frontend\n      ↓\nAxios/Fetch Request\n      ↓\nExpress Route\n      ↓\nMiddleware\n      ↓\nController\n      ↓\nMongoDB\n      ↓\nJWT Authentication\n      ↓\nJSON Response\n      ↓\nFrontend UI Update\n\n--------------------------------------------------\n\nMain Goal of Backend:\n\n- Handle business logic\n- Store/manage data\n- Authenticate users\n- Secure APIs\n- Connect frontend with database"
},

{
  title: "What is Backend Development?",
  answer: "Backend development refers to server-side development.\n\nBackend handles:\n- APIs\n- Databases\n- Authentication\n- Business logic\n- Data processing\n- Security\n\nFrontend shows UI.\nBackend handles actual logic and data.\n\nExample:\n\nFrontend:\nLogin form\n\nBackend:\nChecks username/password from database."
},

{
  title: "What is a Server?",
  answer: "A server is a program/computer that listens for requests and sends responses.\n\nExample:\n\nFrontend sends:\nGET /users\n\nBackend server responds:\n{\n  users: []\n}\n\nServers continuously run and wait for incoming client requests."
},

{
  title: "What is an API?",
  answer: "API stands for Application Programming Interface.\n\nAPI allows frontend and backend to communicate.\n\nExample API:\n\nPOST /login\nGET /notes\nDELETE /user\n\nFrontend calls APIs.\nBackend processes requests and returns responses.\n\nMost modern backends use REST APIs."
},

{
  title: "What is Node.js?",
  answer: "Node.js is a JavaScript runtime environment that allows JavaScript to run outside browser.\n\nBuilt on:\nGoogle Chrome V8 Engine.\n\nNode.js is mainly used for:\n- Servers\n- APIs\n- Realtime apps\n- Backend systems\n\nExample:\n\nconst http = require('http')\n\nhttp.createServer((req, res) => {\n  res.end('Hello')\n}).listen(3000)\n\nThis creates a backend server."
},

{
  title: "Why Node.js is Popular for Backend?",
  answer: "Reasons:\n\n1. JavaScript everywhere\nFrontend + Backend both use JS.\n\n2. Fast execution\nUses V8 engine.\n\n3. Non-blocking architecture\nHandles multiple requests efficiently.\n\n4. Huge npm ecosystem\nMillions of packages available.\n\n5. Realtime support\nExcellent for chat/video/live apps."
},

{
  title: "What is Express.js?",
  answer: "Express.js is a backend framework built on Node.js.\n\nExpress simplifies:\n- Routing\n- Middleware\n- APIs\n- Request handling\n- Response handling\n\nWithout Express:\nNode.js backend becomes complex.\n\nExample:\n\nconst express = require('express')\nconst app = express()\n\napp.get('/', (req, res) => {\n  res.send('Hello')\n})\n\napp.listen(3000)"
},

{
  title: "How to Setup a Backend Project?",
  answer: "Step 1:\nCreate folder.\n\nbackend/\n\n--------------------------------------------------\n\nStep 2:\nOpen VS Code terminal.\n\n--------------------------------------------------\n\nStep 3:\nInitialize Node project.\n\nCommand:\n\nnpm init -y\n\nCreates:\npackage.json\n\n--------------------------------------------------\n\nStep 4:\nInstall dependencies.\n\nExample:\n\nnpm install express mongoose cors dotenv bcryptjs jsonwebtoken\n\n--------------------------------------------------\n\nStep 5:\nInstall nodemon.\n\nnpm install -D nodemon\n\n--------------------------------------------------\n\nStep 6:\nCreate index.js\n\n--------------------------------------------------\n\nStep 7:\nStart backend.\n\nnode index.js\n\nOR:\n\nnpm run dev"
},

{
  title: "What is package.json?",
  answer: "package.json is the main configuration file of Node.js project.\n\nIt stores:\n- Project name\n- Scripts\n- Dependencies\n- Versions\n- Metadata\n\nExample:\n\n{\n  'name': 'backend',\n  'scripts': {\n    'start': 'node index.js'\n  }\n}\n\nBackend project cannot be managed properly without package.json."
},

{
  title: "What is node_modules?",
  answer: "node_modules contains all installed npm packages.\n\nCreated automatically after:\n\nnpm install\n\nContains:\n- Express\n- Mongoose\n- JWT\n- bcrypt\n- All dependencies\n\nUsually very large folder.\n\nNever push node_modules to GitHub."
},

{
  title: "What is npm?",
  answer: "npm stands for Node Package Manager.\n\nUsed for:\n- Installing libraries\n- Managing dependencies\n- Running scripts\n- Publishing packages\n\nExample:\n\nnpm install express"
},

{
  title: "What is Nodemon?",
  answer: "Nodemon automatically restarts backend whenever code changes.\n\nWithout nodemon:\nYou manually restart server every time.\n\nInstall:\n\nnpm install -D nodemon\n\nRun:\n\nnpx nodemon index.js"
},

{
  title: "Basic Express Server Example",
  answer: "Example:\n\nconst express = require('express')\nconst app = express()\n\napp.get('/', (req, res) => {\n  res.send('Backend Running')\n})\n\napp.listen(3000, () => {\n  console.log('Server Started')\n})\n\nExplanation:\n\n1. express() creates backend app.\n\n2. app.get() creates route.\n\n3. res.send() sends response.\n\n4. listen() starts server."
},

{
  title: "What is Routing in Backend?",
  answer: "Routing means defining backend URLs/endpoints.\n\nExample:\n\nGET /users\nPOST /login\nDELETE /note\n\nRoutes decide:\nWhich code executes for which request."
},

{
  title: "What is Middleware?",
  answer: "Middleware runs before route/controller.\n\nExample:\n\napp.use(express.json())\n\nMiddleware can:\n- Parse body\n- Authenticate users\n- Log requests\n- Validate data\n- Handle errors\n\nFlow:\nRequest → Middleware → Route"
},

{
  title: "What is express.json()?",
  answer: "express.json() parses incoming JSON data.\n\nWithout it:\nreq.body becomes undefined.\n\nExample:\n\napp.use(express.json())\n\nFrontend sends:\n\n{\n  username: 'lav'\n}\n\nBackend accesses:\n\nreq.body.username"
},

{
  title: "What is CORS?",
  answer: "CORS stands for Cross-Origin Resource Sharing.\n\nBrowsers block requests between different domains by default.\n\nExample:\nFrontend:\nlocalhost:3001\n\nBackend:\nlocalhost:3000\n\nNeed CORS:\n\nconst cors = require('cors')\napp.use(cors())"
},

{
  title: "What is MongoDB?",
  answer: "MongoDB is a NoSQL database.\n\nStores data in:\nCollections → Documents\n\nUnlike SQL:\nNo tables/rows.\n\nExample document:\n\n{\n  name: 'Lav',\n  age: 21\n}\n\nMongoDB is widely used with Node.js."
},

{
  title: "What is Mongoose?",
  answer: "Mongoose is ODM library for MongoDB.\n\nODM = Object Data Modeling.\n\nMongoose helps:\n- Create schemas\n- Validate data\n- Query database\n- Manage models\n\nInstall:\n\nnpm install mongoose"
},

{
  title: "How MongoDB Connection Works?",
  answer: "Example:\n\nconst mongoose = require('mongoose')\n\nmongoose.connect(process.env.MONGO_URI)\n\nWhat happens internally:\n\n1. Backend connects to MongoDB server.\n\n2. Authentication happens.\n\n3. Database session created.\n\n4. Backend becomes capable of database operations."
},

{
  title: "What is a Schema in Mongoose?",
  answer: "Schema defines structure of documents.\n\nExample:\n\nconst userSchema = new mongoose.Schema({\n  name: String,\n  email: String\n})\n\nSchema defines:\n- Fields\n- Data types\n- Validation\n- Defaults"
},

{
  title: "What is a Model in Mongoose?",
  answer: "Model is used to interact with database collection.\n\nExample:\n\nconst User = mongoose.model('User', userSchema)\n\nNow you can:\n\nUser.find()\nUser.create()\nUser.deleteOne()"
},

{
  title: "What is Authentication?",
  answer: "Authentication means verifying user identity.\n\nExample:\n- Login system\n- JWT verification\n- Password checking\n\nBackend checks:\nIs this user genuine?"
},

{
  title: "Why Passwords are Hashed?",
  answer: "Passwords should never be stored directly.\n\nBad:\npassword: '123456'\n\nGood:\npassword: '$2b$10$abcxyz...'\n\nHashing protects user data if database leaks."
},

{
  title: "What is bcryptjs?",
  answer: "bcryptjs hashes passwords securely.\n\nExample:\n\nconst hashed = await bcrypt.hash(password, 10)\n\nCompare:\n\nawait bcrypt.compare(password, hashed)"
},

{
  title: "What is JWT?",
  answer: "JWT = JSON Web Token.\n\nJWT stores authenticated user identity.\n\nExample:\n\nconst token = jwt.sign({ id: user._id }, SECRET)\n\nFrontend stores token.\n\nFuture requests send token for verification."
},

{
  title: "How JWT Authentication Works?",
  answer: "Step 1:\nUser logs in.\n\nStep 2:\nBackend verifies password.\n\nStep 3:\nBackend creates JWT token.\n\nStep 4:\nFrontend stores token.\n\nStep 5:\nFrontend sends token in future requests.\n\nStep 6:\nBackend verifies token.\n\nIf valid:\nAccess granted."
},

{
  title: "What are Environment Variables?",
  answer: ".env file stores secret/private values.\n\nExample:\n\nPORT=3000\nJWT_SECRET=mysecret\nMONGO_URI=xxxxx\n\nWhy important?\n- Security\n- Easy configuration\n- Production setup\n\nUse dotenv:\n\nrequire('dotenv').config()"
},

{
  title: "What is MVC Architecture?",
  answer: "MVC = Model View Controller.\n\nStructure:\n\nModel → Database logic\nView → Frontend/UI\nController → Business logic\n\nBackend commonly uses:\n\nroutes/\ncontrollers/\nmodels/"
},

{
  title: "Recommended Backend Folder Structure",
  answer: "Example:\n\nbackend/\n│\n├── controllers/\n├── routes/\n├── models/\n├── middleware/\n├── config/\n├── utils/\n├── index.js\n├── .env\n├── package.json\n\nPurpose:\n\ncontrollers → Logic\nroutes → URLs\nmodels → Database\nmiddleware → Authentication/errors\nconfig → DB configs"
},

{
  title: "How Frontend and Backend Connect?",
  answer: "Frontend uses:\n- fetch\n- axios\n\nExample:\n\naxios.get('http://localhost:3000/users')\n\nBackend route handles request.\n\nBackend sends JSON response.\n\nFrontend updates UI."
},

{
  title: "What is CRUD in Backend?",
  answer: "CRUD operations:\n\nC → Create\nR → Read\nU → Update\nD → Delete\n\nExamples:\n\nPOST /user\nGET /users\nPUT /user\nDELETE /user"
},

{
  title: "How Backend Deployment Works?",
  answer: "Backend deployment means hosting backend on internet.\n\nPlatforms:\n- Render\n- Railway\n- AWS\n- Azure\n- VPS\n\nDeployment flow:\n\nCode\n→ GitHub\n→ Cloud Platform\n→ Install dependencies\n→ Start server\n→ Public API generated"
},

{
  title: "Complete Real World Backend Flow",
  answer: "Developer writes backend code.\n\n↓\n\nNode.js runs backend.\n\n↓\n\nExpress handles APIs.\n\n↓\n\nMongoDB stores data.\n\n↓\n\nJWT authenticates users.\n\n↓\n\nFrontend communicates using APIs.\n\n↓\n\nBackend deployed to cloud.\n\n↓\n\nUsers access application globally.\n\n--------------------------------------------------\n\nReal World Example:\n\nReact Frontend\n      ↓\nAxios Request\n      ↓\nExpress Backend\n      ↓\nMiddleware\n      ↓\nController\n      ↓\nMongoDB Database\n      ↓\nJSON Response\n      ↓\nFrontend UI Update"
}

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


  "dockersetup":[
    {
      title: "Complete End-to-End Docker Workflow Explained",
      answer: "Full Docker lifecycle:\n\nCode\n→ Dockerfile\n→ Build Image\n→ Run Container\n→ Push to Docker Hub\n→ Pull Anywhere\n→ Run Anywhere\n\nDetailed Explanation:\n\n1. Write Application Code\nFirst you create your actual application.\n\nExample:\n- React frontend\n- Node.js backend\n- Express APIs\n- MongoDB connection\n- Routes, controllers, components, etc.\n\nAt this stage application runs normally on your local machine.\n\n--------------------------------------------------\n\n2. Create Dockerfile\nA Dockerfile tells Docker how to package your application.\n\nExample Backend Dockerfile:\n\nFROM node:20\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"index.js\"]\n\nDockerfile contains:\n- Base operating environment\n- Dependencies installation\n- File copying\n- Ports\n- Start commands\n\n--------------------------------------------------\n\n3. Build Docker Image\nCommand:\n\ndocker build -t my-backend .\n\nOR using Docker Compose:\n\ndocker compose build\n\nWhat Docker does internally:\n\nStep 1:\nPulls base image (example node:20)\n\nStep 2:\nCreates temporary layers\n\nStep 3:\nCopies package.json\n\nStep 4:\nRuns npm install\n\nStep 5:\nCopies complete source code\n\nStep 6:\nSaves final packaged application as Docker Image\n\nResult:\nA portable image is created.\n\nThis image contains:\n- Node.js\n- Dependencies\n- Source code\n- Configurations\n- Runtime\n\nImage is NOT running yet.\n\n--------------------------------------------------\n\n4. Run Docker Container\nCommand:\n\ndocker run -p 3000:3000 my-backend\n\nOR:\n\ndocker compose up\n\nWhat happens:\n\n1. Docker creates isolated environment\n2. Container starts from image\n3. Application launches\n4. Ports become accessible\n\nNow application becomes live.\n\nExample:\n\nlocalhost:3000\n\nopens backend running inside container.\n\n--------------------------------------------------\n\n5. Push Image to Docker Hub\nFirst login:\n\ndocker login\n\nTag image:\n\ndocker tag my-backend username/my-backend:v1\n\nPush image:\n\ndocker push username/my-backend:v1\n\nWhat happens:\n\n1. Docker uploads image layers to Docker Hub cloud registry\n2. Image becomes globally accessible\n3. Anyone with permission can pull image\n\nDocker Hub works like GitHub but for Docker Images.\n\n--------------------------------------------------\n\n6. Pull Image Anywhere\nAnother user on:\n- Windows\n- Mac\n- Linux\n- Cloud VPS\n- AWS\n- Azure\n- DigitalOcean\n\ncan download image using:\n\ndocker pull username/my-backend:v1\n\nDocker downloads all layers automatically.\n\n--------------------------------------------------\n\n7. Run Anywhere\nAfter pulling image:\n\ndocker run -p 3000:3000 username/my-backend:v1\n\nApplication runs exactly same everywhere.\n\nThis solves:\n- Dependency mismatch\n- Node version mismatch\n- Operating system differences\n- Missing libraries\n- Environment inconsistencies\n\n--------------------------------------------------\n\nReal World Example:\n\nDeveloper Machine:\nWindows + VS Code\n      ↓\nCreate Docker Image\n      ↓\nPush to Docker Hub\n      ↓\nClient pulls image on Mac\n      ↓\nCompany deploys same image on Linux server\n      ↓\nCloud deploys same image on Kubernetes\n\nSame image works everywhere.\n\n--------------------------------------------------\n\nMain Benefit of Docker:\n\n'Build Once, Run Anywhere'\n\nDocker guarantees application consistency across all systems."
    },
    {
      title: "What is Docker?",
      answer: "Docker is a containerization platform that allows developers to package applications along with all dependencies, libraries, runtime, and configurations into lightweight containers.\n\nThese containers run consistently on every machine like Windows, Mac, Linux, cloud servers, and VPS.\n\nMain Goal:\n'Build once, run anywhere.'"
    },
    
    {
      title: "What is a Dockerfile?",
      answer: "A Dockerfile is a text file that contains instructions for Docker to create an image.\n\nIt defines:\n1. Which base image to use\n2. Which dependencies to install\n3. Which files to copy\n4. Which port to expose\n5. Which command to run when container starts\n\nDocker reads Dockerfile step-by-step and creates a Docker image."
    },
    
    {
      title: "What is a Docker Image?",
      answer: "A Docker Image is a blueprint/template used to create containers.\n\nIt contains:\n- Application code\n- Node.js/Python/Java runtime\n- Dependencies\n- Environment variables\n- Libraries\n- Configuration files\n\nImage is NOT running.\nIt is only a packaged application."
    },
    
    {
      title: "What is a Docker Container?",
      answer: "A Docker Container is a running instance of a Docker Image.\n\nAnalogy:\nDockerfile = Recipe\nImage = Frozen prepared food\nContainer = Running cooked food\n\nContainers are isolated environments that run independently from your actual operating system."
    },
    
    {
      title: "Project Structure for Backend + Frontend Docker Setup",
      answer: "Example project structure:\n\nproject-folder/\n│\n├── back/\n│   ├── Dockerfile\n│   ├── package.json\n│   ├── package-lock.json\n│   └── index.js\n│\n├── dash/\n│   ├── Dockerfile\n│   ├── package.json\n│   ├── package-lock.json\n│   └── src/\n│\n└── docker-compose.yml\n\nback = backend folder\n\ndash = frontend React folder"
    },
    
    {
      title: "Backend Dockerfile Explanation",
      answer: "Backend Dockerfile:\n\nFROM node:20\n\nWORKDIR /app\n\nCOPY package*.json ./\n\nRUN npm install\n\nCOPY . .\n\nEXPOSE 3000\n\nCMD [\"node\", \"index.js\"]\n\nExplanation:\n\n1. FROM node:20\nUses official Node.js version 20 image from Docker Hub.\nThis image already contains Node.js installed.\n\n2. WORKDIR /app\nCreates and enters /app folder inside container.\nAll commands run inside this folder.\n\n3. COPY package*.json ./\nCopies package.json and package-lock.json from your PC into container.\n\n4. RUN npm install\nInstalls all backend dependencies inside container.\n\n5. COPY . .\nCopies complete backend source code into container.\n\n6. EXPOSE 3000\nTells Docker that backend application uses port 3000.\n\n7. CMD [\"node\", \"index.js\"]\nStarts backend server when container runs."
    },
    
    {
      title: "Frontend Dockerfile Explanation",
      answer: "Frontend Dockerfile:\n\nFROM node:20\n\nWORKDIR /app\n\nCOPY package*.json ./\n\nRUN npm install\n\nCOPY . .\n\nEXPOSE 3001\n\nCMD [\"npm\", \"start\"]\n\nExplanation:\n\n1. FROM node:20\nUses official Node.js image.\n\n2. WORKDIR /app\nCreates working directory inside container.\n\n3. COPY package*.json ./\nCopies React package files.\n\n4. RUN npm install\nInstalls frontend dependencies.\n\n5. COPY . .\nCopies complete React project.\n\n6. EXPOSE 3001\nFrontend uses port 3001.\n\n7. CMD [\"npm\", \"start\"]\nRuns React development server."
    },
    
    {
      title: "What is docker-compose.yml?",
      answer: "docker-compose.yml is a file used to manage multiple containers together.\n\nInstead of running backend and frontend separately using many commands, Docker Compose starts everything together using one command."
    },
    
    {
      title: "docker-compose.yml Explanation",
      answer: "Example:\n\nservices:\n  backend:\n    build: ./back\n    container_name: backend_container\n    ports:\n      - \"3000:3000\"\n\n  frontend:\n    build: ./dash\n    container_name: frontend_container\n    ports:\n      - \"3001:3001\"\n\nExplanation:\n\n1. services\nDefines multiple containers.\n\n2. backend\nBackend service name.\n\n3. build: ./back\nDocker builds image using back/Dockerfile.\n\n4. container_name\nCustom container name.\n\n5. ports\nMaps your PC port to container port.\n\n3000:3000 means:\nlocalhost:3000 -> container port 3000"
    },
    
    {
      title: "How to Build Docker Images?",
      answer: "Open VS Code terminal in main project folder where docker-compose.yml exists.\n\nRun:\n\ndocker compose build\n\nDocker will:\n1. Read Dockerfiles\n2. Execute commands line-by-line\n3. Install dependencies\n4. Copy code\n5. Create Docker images"
    },
    
    {
      title: "How to Run Containers?",
      answer: "Run:\n\ndocker compose up\n\nOR background mode:\n\ndocker compose up -d\n\nDocker will:\n1. Create containers\n2. Start backend\n3. Start frontend\n4. Create Docker network automatically"
    },
    
    {
      title: "How to Check Running Containers?",
      answer: "Run:\n\ndocker ps\n\nThis shows:\n- Container ID\n- Image name\n- Ports\n- Status\n- Container names"
    },
    
    {
      title: "How to Access Applications?",
      answer: "Frontend:\nhttp://localhost:3001\n\nBackend:\nhttp://localhost:3000\n\nlocalhost means your own computer."
    },
    
    {
      title: "How to See Docker Images?",
      answer: "Run:\n\ndocker images\n\nThis displays all Docker images available on your machine."
    },
    
    {
      title: "How to Stop Containers?",
      answer: "Run:\n\ndocker compose down\n\nThis stops and removes containers created by docker-compose."
    },
    
    {
      title: "How to Rebuild Containers After Code Changes?",
      answer: "Run:\n\ndocker compose up --build\n\nDocker rebuilds images using updated code and starts new containers."
    },
    
    {
      title: "How to Create Docker Hub Account?",
      answer: "Create account on Docker Hub:\n\nhttps://hub.docker.com/\n\nDocker Hub is an online cloud registry used to store Docker images."
    },
    
    {
      title: "How to Login to Docker Hub?",
      answer: "Run:\n\ndocker login\n\nEnter:\n- Docker Hub username\n- Password or access token"
    },
    
    {
      title: "How to Tag Docker Images?",
      answer: "Docker images must be tagged before pushing.\n\nSyntax:\n\ndocker tag local-image dockerhub-username/image-name:tag\n\nExample backend:\n\ndocker tag notenove-backend lavyadav182/notenove-backend:v1\n\nExample frontend:\n\ndocker tag notenove-frontend lavyadav182/notenove-frontend:v1"
    },
    
    {
      title: "How to Push Backend Image to Docker Hub?",
      answer: "Run:\n\ndocker push lavyadav182/notenove-backend:v1\n\nDocker uploads backend image to Docker Hub cloud registry."
    },
    
    {
      title: "How to Push Frontend Image to Docker Hub?",
      answer: "Run:\n\ndocker push lavyadav182/notenove-frontend:v1\n\nFrontend image becomes accessible globally."
    },
    
    {
      title: "Are Docker Images Public or Private?",
      answer: "Docker repositories can be:\n\n1. Public\nAnyone can pull and run your image.\n\n2. Private\nOnly you or authorized users can access image.\n\nVisibility is controlled from Docker Hub settings."
    },
    
    {
      title: "How Another User Can Access Your Docker Images?",
      answer: "Another user on Mac, Windows, or Linux only needs Docker installed.\n\nThey can pull image using:\n\ndocker pull lavyadav182/notenove-frontend:v1\n\ndocker pull lavyadav182/notenove-backend:v1"
    },
    
    {
      title: "How Another User Can Run Your Backend Container?",
      answer: "Run:\n\ndocker run -p 3000:3000 lavyadav182/notenove-backend:v1\n\nThis starts backend container on their machine."
    },
    
    {
      title: "How Another User Can Run Your Frontend Container?",
      answer: "Run:\n\ndocker run -p 3001:3001 lavyadav182/notenove-frontend:v1\n\nThis starts frontend container on their machine."
    },
    
    {
      title: "How Another User Can Access Source Code from Docker Image?",
      answer: "Docker images normally contain packaged applications, not editable Git repositories.\n\nBut files can still be extracted.\n\nSteps:\n\n1. Create container:\n\ndocker create --name tempcontainer image-name\n\n2. Copy files:\n\ndocker cp tempcontainer:/app .\n\n3. Open in VS Code:\n\ncode ."
    },
    
    {
      title: "Difference Between GitHub and Docker Hub",
      answer: "GitHub:\n- Stores source code\n- Used for development\n- Editable code repository\n\nDocker Hub:\n- Stores packaged Docker images\n- Used for deployment and execution\n- Mainly for running applications"
    },
    
    {
      title: "How Docker Networking Works?",
      answer: "Docker Compose automatically creates a private network between containers.\n\nBackend and frontend communicate using service names.\n\nExample frontend API URL inside Docker:\n\nhttp://backend:3000\n\nNOT localhost:3000\n\nbecause localhost inside container means the container itself."
    },
    
    {
      title: "What is Port Mapping?",
      answer: "Example:\n\nports:\n  - \"3000:3000\"\n\nMeaning:\n\nLeft side = your computer port\nRight side = container internal port\n\nlocalhost:3000 -> container:3000"
    },
    
    {
      title: "What Happens Internally During Docker Build?",
      answer: "Docker executes Dockerfile step-by-step:\n\n1. Pull base image\n2. Create container layer\n3. Copy package files\n4. Install dependencies\n5. Copy source code\n6. Save image layer\n7. Final image created\n\nDocker uses caching to speed up future builds."
    },
    
    {
      title: "What Happens Internally During docker compose up?",
      answer: "Docker Compose:\n\n1. Creates network\n2. Creates containers\n3. Attaches volumes\n4. Maps ports\n5. Starts applications\n6. Maintains communication between services"
    },
    
    {
      title: "How to Remove All Containers?",
      answer: "Windows PowerShell:\n\ndocker ps -aq | % { docker rm -f $_ }\n\nThis forcefully stops and removes all containers."
    },
    
    {
      title: "How to Remove All Docker Images?",
      answer: "Windows PowerShell:\n\ndocker images -aq | % { docker rmi -f $_ }\n\nThis removes all Docker images."
    },
    
    {
      title: "How to Clean Entire Docker System?",
      answer: "Run:\n\ndocker system prune -a --volumes -f\n\nThis removes:\n- Containers\n- Images\n- Networks\n- Build cache\n- Volumes"
    },
    
    {
      title: "Full Docker Lifecycle",
      answer: "Complete Docker workflow:\n\n1. Write application code\n2. Create Dockerfile\n3. Build Docker image\n4. Run container\n5. Test application\n6. Push image to Docker Hub\n7. Pull image anywhere\n8. Run application on any OS/cloud/server"
    },
    {
      title: "What is Docker Volume?",
      answer: "Docker Volumes are used to persist data even if containers are deleted.\n\nWithout volumes:\n- Container deletion removes data.\n\nWith volumes:\n- Data remains stored safely.\n\nExample uses:\n- MongoDB database\n- Uploaded files\n- Logs\n- User data"
    },
    {
      title: "How to View Container Logs?",
      answer: "Run:\n\ndocker logs container-name\n\nExample:\n\ndocker logs backend_container\n\nThis shows:\n- Console output\n- Errors\n- Server logs\n- Application startup logs"
    },
    {
      title: "How to Enter Inside Running Container?",
      answer: "Run:\n\ndocker exec -it container-name sh\n\nExample:\n\ndocker exec -it backend_container sh\n\nThis opens terminal inside container.\n\nUseful for:\n- Debugging\n- Checking files\n- Running commands\n- Inspecting environment"
    },
    {
      title: "What is Difference Between docker build and docker compose build?",
      answer: "docker build:\nBuilds one image manually.\n\nExample:\n\ndocker build -t backend .\n\nUsed for single container.\n\n--------------------------------------------------\n\ndocker compose build:\nReads docker-compose.yml and builds multiple services together.\n\nExample:\n\ndocker compose build\n\nUseful for full-stack projects with backend, frontend, database, redis, etc."
    },
    {
      title: "What is Difference Between docker run and docker compose up?",
      answer: "docker run:\nStarts a single container manually.\n\nExample:\n\ndocker run -p 3000:3000 image-name\n\n--------------------------------------------------\n\ndocker compose up:\nStarts all services defined in docker-compose.yml automatically.\n\nUseful for:\n- Full-stack apps\n- Multi-container systems\n- Microservices"
    },
    {
      title: "What is Docker Hub?",
      answer: "Docker Hub is an online cloud registry used to store Docker Images.\n\nFeatures:\n- Push images\n- Pull images\n- Public repositories\n- Private repositories\n- Version tags\n\nIt works similarly to GitHub but stores Docker images instead of source code."
    },
    {
      title: "What is a Docker Tag?",
      answer: "Docker tags are versions of images.\n\nExample:\n\nlavyadav182/notenove-backend:v1\n\nWhere:\n- lavyadav182 = Docker Hub username\n- notenove-backend = repository/image name\n- v1 = version tag\n\nTags help manage multiple versions of applications."
    },
    {
      title: "How Docker Helps in Deployment?",
      answer: "Without Docker:\n- Different Node versions cause issues\n- Missing libraries break app\n- Works on one machine but fails on another\n\nWith Docker:\n- Same environment everywhere\n- Same dependencies everywhere\n- Same runtime everywhere\n- Easier cloud deployment\n\nDocker eliminates 'works on my machine' problems."
    },
    {
      title: "Complete Real-World Docker Flow",
      answer: "Step 1:\nDeveloper writes backend/frontend code.\n\nStep 2:\nCreate Dockerfiles.\n\nStep 3:\nCreate docker-compose.yml.\n\nStep 4:\nBuild images:\n\ndocker compose build\n\nStep 5:\nRun containers:\n\ndocker compose up -d\n\nStep 6:\nTest application locally.\n\nStep 7:\nTag images.\n\nStep 8:\nPush images to Docker Hub.\n\nStep 9:\nClient/server pulls image anywhere.\n\nStep 10:\nApplication runs consistently on:\n- Windows\n- Mac\n- Linux\n- Cloud\n- Kubernetes\n- VPS\n- AWS\n- Azure"
    },

  ],


"cicd": [

{
  title: "Complete End-to-End CI/CD Workflow Explained",
  answer: "Full CI/CD Lifecycle:\n\nWrite Code\n→ Push Code to GitHub\n→ CI Pipeline Triggered\n→ Install Dependencies\n→ Run Tests\n→ Build Application\n→ Create Docker Image\n→ Push Image to Registry\n→ Deploy to Server/Kubernetes\n→ Monitor Application\n\nDetailed Explanation:\n\n1. Write Application Code\n\nDeveloper creates:\n- Frontend\n- Backend\n- APIs\n- Database logic\n- Components\n- Features\n\nExample:\n- React frontend\n- Node.js backend\n- MongoDB database\n\nAt this stage application exists locally.\n\n--------------------------------------------------\n\n2. Push Code to GitHub\n\nDeveloper pushes latest code.\n\nCommands:\n\ngit add .\n\ngit commit -m 'Added new feature'\n\ngit push origin main\n\nWhat happens:\n\n1. Git uploads latest commits.\n\n2. GitHub repository updates.\n\n3. CI/CD pipeline gets triggered automatically.\n\n--------------------------------------------------\n\n3. CI Pipeline Starts Automatically\n\nCI server examples:\n- GitHub Actions\n- Jenkins\n- GitLab CI/CD\n- CircleCI\n- Azure DevOps\n\nPipeline detects:\n- New push\n- Pull request\n- Merge event\n\nNow automated workflow begins.\n\n--------------------------------------------------\n\n4. Install Dependencies\n\nPipeline installs project dependencies.\n\nExample:\n\nnpm install\n\nOR:\n\npip install -r requirements.txt\n\nPurpose:\n- Install libraries\n- Prepare build environment\n- Setup runtime dependencies\n\n--------------------------------------------------\n\n5. Run Automated Tests\n\nPipeline runs:\n- Unit tests\n- Integration tests\n- API tests\n- UI tests\n\nExample:\n\nnpm test\n\nWhat happens:\n\n1. Code quality checked.\n\n2. Bugs detected automatically.\n\n3. Failed tests stop deployment.\n\nThis prevents broken code from reaching production.\n\n--------------------------------------------------\n\n6. Build Application\n\nPipeline creates production build.\n\nFrontend Example:\n\nnpm run build\n\nBackend Example:\n\nmvn package\n\nWhat happens:\n\n1. Source code optimized.\n\n2. Static assets generated.\n\n3. Production-ready files created.\n\n--------------------------------------------------\n\n7. Build Docker Image\n\nCommand:\n\ndocker build -t myapp:v1 .\n\nWhat happens:\n\n1. Docker packages application.\n\n2. Runtime environment included.\n\n3. Dependencies bundled.\n\n4. Portable image created.\n\nNow application becomes deployable anywhere.\n\n--------------------------------------------------\n\n8. Push Docker Image to Registry\n\nExample registries:\n- Docker Hub\n- AWS ECR\n- GitHub Container Registry\n- Google Container Registry\n\nCommand:\n\ndocker push username/myapp:v1\n\nWhat happens:\n\n1. Docker image uploads to cloud registry.\n\n2. Servers can now access image globally.\n\n--------------------------------------------------\n\n9. CD Pipeline Deploys Application\n\nDeployment targets:\n- VPS\n- Kubernetes\n- AWS\n- Azure\n- GCP\n- Render\n- Railway\n- Vercel\n\nDeployment tools:\n- kubectl\n- Helm\n- Docker Compose\n- Terraform\n\nExample:\n\nkubectl apply -f deployment.yaml\n\nApplication becomes live globally.\n\n--------------------------------------------------\n\n10. Monitoring and Logging\n\nAfter deployment:\n- Logs monitored\n- Errors tracked\n- Performance checked\n- Alerts generated\n\nTools:\n- Grafana\n- Prometheus\n- ELK Stack\n- Datadog\n- New Relic\n\n--------------------------------------------------\n\nReal World CI/CD Flow:\n\nDeveloper writes code\n      ↓\nPushes code to GitHub\n      ↓\nGitHub Actions starts pipeline\n      ↓\nTests run automatically\n      ↓\nDocker image built\n      ↓\nImage pushed to Docker Hub\n      ↓\nKubernetes pulls latest image\n      ↓\nApplication deployed automatically\n      ↓\nMonitoring tools track health\n\n--------------------------------------------------\n\nMain Goal of CI/CD:\n\n- Faster deployments\n- Automated testing\n- Reliable releases\n- Continuous delivery\n- Reduced human errors\n- Faster development cycle"
},

{
  title: "What is CI?",
  answer: "CI stands for Continuous Integration.\n\nDevelopers frequently merge code into shared repository.\n\nAutomated systems:\n- Build application\n- Run tests\n- Detect bugs\n- Validate code\n\nPurpose:\nCatch issues early during development."
},

{
  title: "What is CD?",
  answer: "CD stands for Continuous Delivery or Continuous Deployment.\n\nAfter CI succeeds:\n- Application gets deployed automatically\n- Servers update automatically\n- Users receive latest version faster\n\nPurpose:\nAutomate software release process."
},

{
  title: "Difference Between Continuous Delivery and Continuous Deployment",
  answer: "Continuous Delivery:\nDeployment ready automatically.\nHuman approval required before production deployment.\n\n--------------------------------------------------\n\nContinuous Deployment:\nDeployment happens fully automatically without manual approval.\n\nEvery successful build goes live automatically."
},

{
  title: "What is CI/CD Pipeline?",
  answer: "CI/CD pipeline is automated workflow that:\n\n1. Builds code\n2. Tests application\n3. Packages software\n4. Deploys application\n5. Monitors system\n\nPipeline removes manual deployment work."
},

{
  title: "Why CI/CD is Important?",
  answer: "Benefits:\n\n- Faster software delivery\n- Reduced bugs\n- Automated deployments\n- Easier collaboration\n- Reliable releases\n- Continuous testing\n- Better scalability\n- Reduced manual errors"
},

{
  title: "What is GitHub Actions?",
  answer: "GitHub Actions is GitHub's CI/CD platform.\n\nAllows:\n- Automated workflows\n- Testing\n- Deployment\n- Docker builds\n- Kubernetes deployment\n\nWorkflow files stored inside:\n\n.github/workflows/"
},

{
  title: "How GitHub Actions Workflow Works?",
  answer: "Workflow Flow:\n\nGit Push\n      ↓\nWorkflow Triggered\n      ↓\nRunner Machine Starts\n      ↓\nSteps Execute One-by-One\n      ↓\nTests Run\n      ↓\nDeployment Happens\n\nEverything becomes automated."
},

{
  title: "What is a GitHub Actions Runner?",
  answer: "Runner is machine that executes CI/CD jobs.\n\nGitHub provides:\n- Ubuntu runners\n- Windows runners\n- Mac runners\n\nRunner performs:\n- Code checkout\n- Dependency installation\n- Testing\n- Deployment"
},

{
  title: "Basic GitHub Actions Workflow Example",
  answer: "Example:\n\nname: CI Pipeline\n\non:\n  push:\n    branches:\n      - main\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Install Dependencies\n        run: npm install\n\n      - name: Run Tests\n        run: npm test\n\n      - name: Build Project\n        run: npm run build"
},

{
  title: "What Happens Internally During CI/CD Pipeline?",
  answer: "Internally:\n\n1. Repository cloned.\n\n2. Virtual machine created.\n\n3. Dependencies installed.\n\n4. Tests executed.\n\n5. Build generated.\n\n6. Docker image created.\n\n7. Deployment triggered.\n\n8. Logs generated.\n\nPipeline executes automatically step-by-step."
},

{
  title: "What is Build Stage in CI/CD?",
  answer: "Build stage converts source code into deployable application.\n\nExamples:\n- React build\n- Java JAR creation\n- Docker image creation\n- Next.js production build\n\nCommands:\n\nnpm run build\n\nmvn package"
},

{
  title: "What is Test Stage in CI/CD?",
  answer: "Test stage validates application.\n\nTypes:\n- Unit testing\n- API testing\n- Integration testing\n- UI testing\n\nPurpose:\nPrevent broken code from deployment."
},

{
  title: "What is Deployment Stage in CI/CD?",
  answer: "Deployment stage publishes application.\n\nTargets:\n- Cloud servers\n- Kubernetes\n- Docker containers\n- VPS\n- AWS\n- Azure\n\nDeployment becomes automatic after successful tests."
},

{
  title: "What is Artifact in CI/CD?",
  answer: "Artifact is generated output from build stage.\n\nExamples:\n- React build folder\n- JAR files\n- WAR files\n- Docker images\n- ZIP packages\n\nArtifacts are stored and later deployed."
},

{
  title: "How Docker is Used in CI/CD?",
  answer: "Docker makes deployments consistent.\n\nCI/CD Flow:\n\nCode\n→ Docker Build\n→ Docker Push\n→ Deployment\n\nBenefits:\n- Same environment everywhere\n- Easier deployment\n- Better scalability\n- Faster builds"
},

{
  title: "How Kubernetes is Used in CI/CD?",
  answer: "CI/CD pipelines deploy applications directly into Kubernetes clusters.\n\nCommands:\n\nkubectl apply -f deployment.yaml\n\nOR:\n\nhelm upgrade --install app ./chart\n\nKubernetes manages:\n- Scaling\n- Availability\n- Rolling updates"
},

{
  title: "What is Rolling Deployment?",
  answer: "Rolling deployment updates application gradually.\n\nOld containers replaced step-by-step.\n\nBenefits:\n- Zero downtime\n- Safer updates\n- Continuous availability"
},

{
  title: "What is Blue-Green Deployment?",
  answer: "Two environments exist:\n\nBlue = Current production\nGreen = New version\n\nTraffic switches to green after successful testing.\n\nBenefits:\n- Instant rollback\n- Safer deployments"
},

{
  title: "What is Canary Deployment?",
  answer: "New version released to small percentage of users first.\n\nExample:\n- 5% users get new version\n- Monitor errors\n- Gradually increase traffic\n\nBenefits:\n- Reduced deployment risk"
},

{
  title: "How Secrets are Managed in CI/CD?",
  answer: "Sensitive data stored securely.\n\nExamples:\n- API keys\n- Database passwords\n- Docker tokens\n- AWS credentials\n\nGitHub Example:\n\nSettings → Secrets and Variables\n\nSecrets remain encrypted."
},

{
  title: "What is Environment Variable in CI/CD?",
  answer: "Environment variables store configuration values.\n\nExamples:\n- PORT\n- DATABASE_URL\n- JWT_SECRET\n- API_KEY\n\nUsed to avoid hardcoding sensitive values."
},

{
  title: "How Auto Deployment Works?",
  answer: "Flow:\n\nDeveloper pushes code\n      ↓\nPipeline triggered\n      ↓\nTests pass\n      ↓\nDeployment starts automatically\n      ↓\nServer updated\n      ↓\nApplication goes live"
},

{
  title: "How Rollback Works in CI/CD?",
  answer: "Rollback restores previous stable version.\n\nKubernetes Example:\n\nkubectl rollout undo deployment/app\n\nPurpose:\nRecover quickly from failed deployment."
},

{
  title: "How CI/CD Helps Teams?",
  answer: "CI/CD improves:\n- Team collaboration\n- Faster releases\n- Stable deployments\n- Automated testing\n- Developer productivity\n- Deployment consistency"
},

{
  title: "What is Self-Hosted Runner?",
  answer: "Self-hosted runner is your own machine/server executing CI/CD jobs.\n\nBenefits:\n- Custom hardware\n- Private infrastructure\n- Faster execution\n- Internal deployments"
},

{
  title: "What is YAML in CI/CD?",
  answer: "YAML is configuration language used to define pipelines.\n\nExamples:\n- GitHub Actions\n- GitLab CI/CD\n- Kubernetes manifests\n- Docker Compose\n\nYAML defines:\n- Jobs\n- Steps\n- Variables\n- Deployment logic"
},

{
  title: "Complete Real World CI/CD Workflow",
  answer: "Developer writes code.\n\n↓\n\nPushes code to GitHub.\n\n↓\n\nGitHub Actions pipeline starts.\n\n↓\n\nDependencies install automatically.\n\n↓\n\nAutomated tests run.\n\n↓\n\nProduction build created.\n\n↓\n\nDocker image built.\n\n↓\n\nImage pushed to Docker Hub.\n\n↓\n\nKubernetes pulls latest image.\n\n↓\n\nApplication deployed automatically.\n\n↓\n\nMonitoring tools track logs and metrics.\n\n--------------------------------------------------\n\nReal World Example:\n\nDeveloper Machine\n      ↓\nGitHub Repository\n      ↓\nGitHub Actions CI/CD\n      ↓\nDocker Build\n      ↓\nDocker Hub Registry\n      ↓\nKubernetes Cluster\n      ↓\nProduction Application"
}

],


"aws": [
  {
    title: "What is the complete AWS CLI-based workflow to deploy and run a full backend application using S3, EC2, IAM, and CloudWatch?",
    answer: "The AWS CLI-based deployment workflow shows how a complete backend application is built, deployed, secured, and monitored on AWS using services like IAM, S3, EC2, and CloudWatch. This is the real-world DevOps flow used in production systems.\n\n---\n\n1. CONFIGURE AWS CLI (INITIAL SETUP)\nBefore doing anything, AWS CLI must be configured with credentials.\n\nCommand:\naws configure\n\nYou enter:\n- AWS Access Key\n- AWS Secret Key\n- Region (e.g., ap-south-1)\n- Output format (json)\n\nThis allows your local machine to interact with AWS services securely.\n\n---\n\n2. CREATE IAM USER (SECURITY SETUP)\nInstead of using root account, a secure IAM user is created.\n\nCommand:\naws iam create-user --user-name dev-user\n\nThen attach permissions:\naws iam attach-user-policy \\\n  --user-name dev-user \\\n  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess\n\nExplanation:\n- IAM controls access to AWS services\n- Best practice: use least privilege, not full admin in real systems\n\n---\n\n3. CREATE AND CONFIGURE S3 BUCKET (FILE STORAGE)\nS3 is used to store application files, build outputs, or assets.\n\nCreate bucket:\naws s3 mb s3://my-app-bucket-123\n\nUpload backend or build files:\naws s3 cp app.zip s3://my-app-bucket-123/\n\nExplanation:\n- S3 acts as object storage\n- Used for backups, deployments, static files\n\n---\n\n4. LAUNCH EC2 INSTANCE (SERVER CREATION)\nEC2 is where the backend runs (Node.js, Express, etc.).\n\nCommand:\naws ec2 run-instances \\\n  --image-id ami-xxxxxxxx \\\n  --count 1 \\\n  --instance-type t2.micro \\\n  --key-name my-key \\\n  --security-groups my-sg\n\nExplanation:\n- EC2 = virtual server in cloud\n- You choose OS using AMI\n- Security group controls traffic\n\n---\n\n5. CONNECT TO EC2 SERVER\nAfter launching, connect via SSH:\n\nssh -i my-key.pem ec2-user@<public-ip>\n\nNow you are inside cloud server.\n\n---\n\n6. INSTALL DEPENDENCIES ON EC2\nInside EC2:\n\nsudo yum update -y\nsudo yum install nodejs npm -y\n\nThen upload or clone project:\n\ngit clone <repo-url>\ncd project\nnpm install\n\n---\n\n7. RUN BACKEND SERVER\nStart application:\n\nnode index.js\nor\nnpm start\n\nNow backend is live on EC2 public IP.\n\n---\n\n8. CONFIGURE SECURITY GROUP (FIREWALL RULES)\nAllow HTTP/SSH access:\n\nExample SSH rule:\naws ec2 authorize-security-group-ingress \\\n  --group-id sg-xxxx \\\n  --protocol tcp \\\n  --port 22 \\\n  --cidr 0.0.0.0/0\n\nExample HTTP rule:\nPort 80 or 3000 open for API access\n\n---\n\n9. CONNECT S3 WITH APPLICATION (OPTIONAL STORAGE FLOW)\nBackend can upload files to S3 using AWS SDK.\n\nExample flow:\nUser uploads file → Backend → S3 bucket\n\n---\n\n10. MONITORING WITH CLOUDWATCH\nCloudWatch tracks logs and system performance.\n\nCreate log group:\naws logs create-log-group --log-group-name my-app-logs\n\nSend metrics:\naws cloudwatch put-metric-data \\\n  --metric-name CPUUsage \\\n  --namespace MyApp \\\n  --value 75\n\nExplanation:\n- CloudWatch helps monitor errors, CPU, traffic\n- Used for debugging production systems\n\n---\n\n11. OPTIONAL: AUTOMATION USING CLOUD FORMATION\nInstead of manual setup, infrastructure can be automated.\n\nCreate stack:\naws cloudformation create-stack \\\n  --stack-name my-stack \\\n  --template-body file://template.yaml\n\nThis creates full infrastructure automatically.\n\n---\n\n12. DEPLOYMENT FLOW SUMMARY\nLocal Code → S3 (storage) → EC2 (server) → Run backend → IAM (permissions) → CloudWatch (monitoring)\n\n---\n\nREAL-WORLD FLOW:\nDeveloper writes code → uploads to AWS → EC2 runs backend → S3 stores assets → IAM secures access → CloudWatch monitors system\n\n---\n\nKEY AWS CONCEPTS:\n- IAM = Security & Access Control\n- S3 = Storage\n- EC2 = Compute Server\n- CloudWatch = Monitoring\n- CLI = Command-line automation tool\n\n---\n\nThis workflow is the foundation of DevOps pipelines, backend deployments, scalable systems, and production-grade cloud architecture."
  },
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


"authentication":[
  {
    title: "What is the complete authentication workflow (JWT-based) in a MERN stack application?",
    answer: "The JWT-based authentication workflow in a MERN (MongoDB, Express, React, Node.js) application is a complete step-by-step process that ensures only valid users can access protected resources. It involves frontend, backend, database, password security, token generation, and request validation.\n\n---\n\n1. USER REGISTERS OR LOGS IN\nThe workflow starts when a user submits credentials from the frontend.\n\nExample (Login Request):\nPOST /api/auth/login\n{\n  \"email\": \"user@gmail.com\",\n  \"password\": \"123456\"\n}\n\nThis request is sent using Axios or fetch from React.\n\n---\n\n2. REQUEST REACHES EXPRESS SERVER\nExpress receives the request and routes it to the authentication controller.\n\nExample route:\n\nrouter.post('/login', loginController);\n\nMiddleware like express.json() parses incoming JSON data so it becomes:\n\nreq.body = {\n  email: 'user@gmail.com',\n  password: '123456'\n}\n\n---\n\n3. USER VERIFICATION (DATABASE CHECK)\nBackend checks if the user exists in MongoDB.\n\nExample:\n\nconst user = await User.findOne({ email });\n\nIf user does not exist:\n→ return 404 (User not found)\n\n---\n\n4. PASSWORD VERIFICATION (BCRYPT)\nIf user exists, password is verified using bcrypt.\n\nExample:\n\nconst isMatch = await bcrypt.compare(password, user.password);\n\nExplanation:\n- User enters plain password\n- Database stores hashed password\n- bcrypt compares both securely\n\nIf password is incorrect:\n→ return 401 Unauthorized\n\n---\n\n5. JWT TOKEN GENERATION\nIf credentials are valid, backend generates a JWT token.\n\nExample:\n\nconst token = jwt.sign(\n  { _id: user._id, role: user.role },\n  process.env.JWT_SECRET,\n  { expiresIn: '7d' }\n);\n\nToken contains:\n- User ID\n- Role (admin/user)\n- Expiry time\n\n---\n\n6. TOKEN SENT TO FRONTEND\nBackend sends token in response:\n\nres.json({\n  message: \"Login successful\",\n  token\n});\n\n---\n\n7. FRONTEND STORES TOKEN\nFrontend stores token for future requests.\n\nExample:\n\nlocalStorage.setItem('token', token);\n\nNow user remains logged in even after refresh.\n\n---\n\n8. ACCESSING PROTECTED ROUTES\nWhen user tries to access protected pages (dashboard/profile):\n\nFrontend sends token in headers:\n\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIs...\n\n---\n\n9. AUTH MIDDLEWARE (TOKEN VERIFICATION)\nBackend middleware intercepts request:\n\nconst token = req.headers.authorization.split(' ')[1];\n\nThen verifies token:\n\nconst decoded = jwt.verify(token, process.env.JWT_SECRET);\n\nIf token is invalid or expired:\n→ return 401 Unauthorized\n\nIf valid:\n→ attach user data to request:\n\nreq.user = decoded;\nnext();\n\n---\n\n10. PROTECTED ROUTE EXECUTION\nAfter verification, request reaches actual route handler.\n\nExample:\n\nrouter.get('/profile', authMiddleware, async (req, res) => {\n  const user = await User.findById(req.user._id);\n  res.json(user);\n});\n\n---\n\n11. RESPONSE SENT TO FRONTEND\nBackend sends protected data:\n\n{\n  name: \"Lav\",\n  email: \"user@gmail.com\"\n}\n\nFrontend displays it in UI.\n\n---\n\n12. LOGOUT FLOW\nWhen user logs out:\n\nFrontend removes token:\n\nlocalStorage.removeItem('token');\n\nNow user cannot access protected routes.\n\n---\n\nFULL FLOW SUMMARY\nFrontend Login → Express Route → MongoDB User Check → bcrypt Password Compare → JWT Token Generation → Token Sent → Frontend Stores Token → Token Sent in Headers → Middleware Verifies Token → Protected Route Access → Response Sent → UI Updated\n\n---\n\nKEY SECURITY POINTS:\n- Passwords are never stored in plain text (bcrypt hashing)\n- JWT ensures stateless authentication\n- Token expiry prevents long-term misuse\n- Middleware protects sensitive routes\n- JWT secret must always be hidden in .env\n\n---\n\nThis workflow is the backbone of modern authentication systems used in applications like e-commerce, dashboards, social media, and SaaS platforms."
  },
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

"interview":[
  {
    title: "Give me your introduction.",
    answer: "Start confidently: 'I am Your name, a Branch and College Name with strong interest in Software Development and Full-Stack Engineering. I have built projects like NoteNova, Stock Trading Web App, and worked on ConvergeFi website redevelopment during my internship at Marketing Tusk. My core skills are React.js, Node.js, MongoDB, SQL, APIs, and DSA. I have solved 300+ LeetCode problems and enjoy building scalable real-world applications.'"
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


"kubernetes-setup":[
  {
    title: "Complete End-to-End Kubernetes Workflow Explained",
    answer: "Full Kubernetes lifecycle:\n\nCode\n→ Dockerfile\n→ Docker Image\n→ Push to Docker Hub\n→ Kubernetes YAML Files\n→ Kubernetes Cluster\n→ Deployments\n→ ReplicaSets\n→ Pods\n→ Services\n→ Browser Access\n→ Auto Scaling + Self Healing\n\nDetailed Explanation:\n\n==================================================\n\n1. Write Application Code\n\nFirst you create your actual application.\n\nExample:\n- React frontend\n- Node.js backend\n- Express APIs\n- MongoDB connection\n- Authentication\n- Components\n- Routes\n- Controllers\n\nExample Structure:\n\nNoteNova/\n│\n├── back/\n│   ├── index.js\n│   ├── routes/\n│   ├── schema/\n│   └── package.json\n│\n├── dash/\n│   ├── src/\n│   ├── public/\n│   └── package.json\n│\n└── k8s/\n\nAt this stage:\nApplication runs normally on your computer.\n\nBackend:\nlocalhost:3000\n\nFrontend:\nlocalhost:3001\n\nBut this is NOT production-ready.\n\nProblems still exist:\n- Dependency mismatch\n- OS mismatch\n- Server crashes\n- Manual scaling\n- Manual deployment\n\nThis is where Docker + Kubernetes come.\n\n==================================================\n\n2. Create Dockerfiles\n\nNow you package applications using Docker.\n\n------------------------------------------\nBackend Dockerfile\n------------------------------------------\n\nFROM node:20\n\nWORKDIR /app\n\nCOPY package*.json ./\n\nRUN npm install\n\nCOPY . .\n\nEXPOSE 3000\n\nCMD [\"node\", \"index.js\"]\n\n------------------------------------------\nFrontend Dockerfile\n------------------------------------------\n\nFROM node:20\n\nWORKDIR /app\n\nCOPY package*.json ./\n\nRUN npm install\n\nCOPY . .\n\nEXPOSE 3001\n\nCMD [\"npm\", \"start\"]\n\n--------------------------------------------------\n\nWhat Dockerfile Does Internally:\n\nStep 1:\nDownloads Node.js environment.\n\nStep 2:\nCreates isolated filesystem.\n\nStep 3:\nCopies package.json.\n\nStep 4:\nInstalls dependencies.\n\nStep 5:\nCopies source code.\n\nStep 6:\nDefines startup command.\n\nResult:\nApplication becomes portable.\n\n==================================================\n\n3. Build Docker Images\n\nCommands:\n\nBackend:\n\ndocker build -t lavyadav182/notenove-backend:v1 ./back\n\nFrontend:\n\ndocker build -t lavyadav182/notenove-frontend:v1 ./dash\n\n--------------------------------------------------\n\nWhat Happens Internally During Build?\n\nStep 1:\nDocker reads Dockerfile.\n\nStep 2:\nDocker pulls base image.\n\nExample:\nnode:20\n\nStep 3:\nDocker creates temporary build layers.\n\nStep 4:\nCopies package.json.\n\nStep 5:\nRuns npm install.\n\nStep 6:\nCopies complete source code.\n\nStep 7:\nSaves final packaged image.\n\nResult:\nDocker Images created.\n\nThese images contain:\n- Node.js\n- Dependencies\n- Runtime\n- Source code\n- Configurations\n\nImage is NOT running yet.\n\n==================================================\n\n4. Push Images to Docker Hub\n\nDocker Hub stores images online.\n\n------------------------------------------\nLogin\n------------------------------------------\n\ndocker login\n\n------------------------------------------\nPush Backend\n------------------------------------------\n\ndocker push lavyadav182/notenove-backend:v1\n\n------------------------------------------\nPush Frontend\n------------------------------------------\n\ndocker push lavyadav182/notenove-frontend:v1\n\n--------------------------------------------------\n\nWhat Happens Internally?\n\n1. Docker compresses image layers.\n2. Uploads layers to Docker Hub.\n3. Images become globally accessible.\n\nNow:\nKubernetes can pull images from anywhere.\n\n==================================================\n\n5. Enable Kubernetes in Docker Desktop\n\nSteps:\n\n1. Open Docker Desktop.\n2. Open Settings.\n3. Go to Kubernetes section.\n4. Enable:\n   'Enable Kubernetes'\n5. Click Apply & Restart.\n\n--------------------------------------------------\n\nWhat Happens Internally?\n\nDocker Desktop creates:\n- Kubernetes Cluster\n- Control Plane\n- Worker Node\n- Networking\n- Internal DNS\n\nYour PC now behaves like mini cloud infrastructure.\n\n==================================================\n\n6. Verify Kubernetes Connection\n\nRun:\n\nkubectl get nodes\n\nExample Output:\n\nNAME             STATUS   ROLES           AGE\ndocker-desktop   Ready    control-plane\n\nMeaning:\nKubernetes cluster is running successfully.\n\n==================================================\n\n7. Create Kubernetes YAML Files\n\nNow Kubernetes needs instructions.\n\nCreate folder:\n\nk8s/\n\nInside it create:\n\nbackend-deployment.yaml\nbackend-service.yaml\nfrontend-deployment.yaml\nfrontend-service.yaml\n\nThese YAML files tell Kubernetes:\n- Which images to use\n- How many Pods to create\n- Which ports to expose\n- How networking works\n\n==================================================\n\n8. Create Backend Deployment YAML\n\nFile:\nbackend-deployment.yaml\n\nCode:\n\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: backend-deployment\n\nspec:\n  replicas: 2\n\n  selector:\n    matchLabels:\n      app: backend\n\n  template:\n    metadata:\n      labels:\n        app: backend\n\n    spec:\n      containers:\n      - name: backend\n        image: lavyadav182/notenove-backend:v1\n\n        ports:\n        - containerPort: 3000\n\n--------------------------------------------------\n\nWhat This Means?\n\nkind: Deployment\n→ Create Deployment object.\n\nreplicas: 2\n→ Create 2 backend Pods.\n\nimage:\n→ Pull image from Docker Hub.\n\ncontainerPort: 3000\n→ Backend internally uses port 3000.\n\n==================================================\n\n9. Create Backend Service YAML\n\nFile:\nbackend-service.yaml\n\nCode:\n\napiVersion: v1\nkind: Service\nmetadata:\n  name: backend-service\n\nspec:\n  selector:\n    app: backend\n\n  ports:\n    - protocol: TCP\n      port: 3000\n      targetPort: 3000\n      nodePort: 30080\n\n  type: NodePort\n\n--------------------------------------------------\n\nWhat This Means?\n\nService connects users to Pods.\n\nselector:\nFind backend Pods.\n\ntargetPort:\nContainer port.\n\nnodePort:\nExternal browser port.\n\nNodePort makes backend accessible:\n\nlocalhost:30080\n\n==================================================\n\n10. Create Frontend Deployment YAML\n\nFile:\nfrontend-deployment.yaml\n\nCode:\n\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: frontend-deployment\n\nspec:\n  replicas: 2\n\n  selector:\n    matchLabels:\n      app: frontend\n\n  template:\n    metadata:\n      labels:\n        app: frontend\n\n    spec:\n      containers:\n      - name: frontend\n        image: lavyadav182/notenove-frontend:v1\n\n        ports:\n        - containerPort: 3001\n\n==================================================\n\n11. Create Frontend Service YAML\n\nFile:\nfrontend-service.yaml\n\nCode:\n\napiVersion: v1\nkind: Service\nmetadata:\n  name: frontend-service\n\nspec:\n  selector:\n    app: frontend\n\n  ports:\n    - protocol: TCP\n      port: 3001\n      targetPort: 3001\n      nodePort: 30001\n\n  type: NodePort\n\n==================================================\n\n12. Apply Kubernetes YAML Files\n\nNow deploy everything.\n\nCommands:\n\nkubectl apply -f backend-deployment.yaml\n\nkubectl apply -f backend-service.yaml\n\nkubectl apply -f frontend-deployment.yaml\n\nkubectl apply -f frontend-service.yaml\n\n--------------------------------------------------\n\nWhat Happens Internally?\n\nStep 1:\nYAML sent to Kubernetes API Server.\n\nStep 2:\nDeployment objects created.\n\nStep 3:\nReplicaSets created.\n\nStep 4:\nPods created.\n\nStep 5:\nKubernetes pulls Docker images.\n\nStep 6:\nContainers start running.\n\nStep 7:\nServices expose Pods.\n\nApplication becomes live.\n\n==================================================\n\n13. Internal Kubernetes Architecture Flow\n\nDeployment\n↓\nReplicaSet\n↓\nPods\n↓\nContainers\n\nService sits in front of Pods.\n\nUsers connect to Service.\n\nService distributes traffic across Pods.\n\n==================================================\n\n14. Check Running Resources\n\n------------------------------------------\nCheck Deployments\n------------------------------------------\n\nkubectl get deployments\n\n------------------------------------------\nCheck Pods\n------------------------------------------\n\nkubectl get pods\n\n------------------------------------------\nCheck Services\n------------------------------------------\n\nkubectl get services\n\n==================================================\n\n15. Access Application\n\nFrontend:\n\nhttp://localhost:30001\n\nBackend:\n\nhttp://localhost:30080\n\nNow applications are running inside Kubernetes cluster.\n\n==================================================\n\n16. What Happens If Pod Crashes?\n\nExample:\nOne backend Pod crashes.\n\nKubernetes Flow:\n\n1. kubelet detects failure.\n2. Control Plane notified.\n3. ReplicaSet notices missing Pod.\n4. New Pod created automatically.\n5. Service redirects traffic.\n\nApplication stays online.\n\nThis is called:\nSELF HEALING\n\n==================================================\n\n17. What Happens During High Traffic?\n\nSuppose:\nThousands of users open your frontend.\n\nYou scale application.\n\nCommand:\n\nkubectl scale deployment frontend-deployment --replicas=5\n\nNow Kubernetes creates:\n5 frontend Pods.\n\nTraffic distributed automatically.\n\nThis is called:\nHORIZONTAL SCALING\n\n==================================================\n\n18. What Happens During Application Update?\n\nSuppose you push new frontend version.\n\nPush new image:\n\nlavyadav182/notenove-frontend:v2\n\nUpdate Deployment:\n\nkubectl set image deployment/frontend-deployment frontend=lavyadav182/notenove-frontend:v2\n\n--------------------------------------------------\n\nWhat Kubernetes Does?\n\n1. Creates new Pods.\n2. Gradually removes old Pods.\n3. Keeps application online.\n4. No downtime occurs.\n\nThis is called:\nROLLING UPDATE\n\n==================================================\n\n19. Kubernetes Networking\n\nInside Kubernetes:\n\nFrontend does NOT call:\n\nhttp://localhost:3000\n\nInstead frontend calls:\n\nhttp://backend-service:3000\n\nWhy?\n\nBecause:\nlocalhost inside Pod means same Pod only.\n\nKubernetes provides internal DNS automatically.\n\n==================================================\n\n20. How Another User Runs Your Kubernetes Project\n\nAnother user needs:\n\n1. Docker Desktop\n2. Kubernetes enabled\n3. kubectl installed\n4. YAML files\n5. Internet access\n\nThen they run:\n\nkubectl apply -f backend-deployment.yaml\nkubectl apply -f backend-service.yaml\nkubectl apply -f frontend-deployment.yaml\nkubectl apply -f frontend-service.yaml\n\nKubernetes downloads images automatically.\n\nApplication runs on:\n\nlocalhost:30001\nlocalhost:30080\n\n==================================================\n\n21. Real Production Workflow\n\nDeveloper Laptop\n↓\nCreate Docker Images\n↓\nPush Images to Docker Hub\n↓\nKubernetes Pulls Images\n↓\nDeployments Created\n↓\nPods Created\n↓\nServices Exposed\n↓\nUsers Access Application\n↓\nKubernetes Continuously Monitors Everything\n\n==================================================\n\n22. Main Superpowers of Kubernetes\n\nKubernetes automatically handles:\n\n- Auto scaling\n- Self healing\n- Load balancing\n- Rolling updates\n- Container recovery\n- Networking\n- Traffic distribution\n- Service discovery\n- High availability\n- Zero downtime deployment\n\n==================================================\n\n23. Final Complete Kubernetes Lifecycle\n\nCode\n→ Dockerfile\n→ Docker Image\n→ Docker Hub\n→ Kubernetes YAML\n→ kubectl apply\n→ Deployment\n→ ReplicaSet\n→ Pods\n→ Services\n→ Browser Access\n→ Auto Scaling\n→ Self Healing\n→ Rolling Updates\n→ Production Deployment\n\n==================================================\n\nMain Goal of Kubernetes:\n\n'Automatically manage containerized applications at production scale.'"
  },
  {
    title: "What is Kubernetes?",
    answer: "Kubernetes (K8s) is a container orchestration platform used to manage Docker containers automatically.\n\nDocker creates containers.\nKubernetes manages containers.\n\nKubernetes can:\n- Deploy applications\n- Scale applications\n- Restart crashed containers\n- Load balance traffic\n- Manage networking\n- Perform rolling updates\n- Handle high traffic automatically\n\nMain Goal:\n'Automate container management at large scale.'"
  },
  
  {
    title: "Why Kubernetes is Used After Docker?",
    answer: "Docker alone works well for small projects.\n\nBut in real-world production:\n- Multiple containers exist\n- Traffic increases suddenly\n- Servers crash\n- Containers fail\n- Load balancing is needed\n- Auto scaling is needed\n- Zero downtime deployment is needed\n\nKubernetes solves all these problems automatically."
  },
  
  {
    title: "Difference Between Docker and Kubernetes",
    answer: "Docker:\n- Creates containers\n- Runs containers\n- Single machine focus\n\nKubernetes:\n- Manages containers\n- Scales containers\n- Restarts failed containers\n- Distributes traffic\n- Works on clusters\n\nDocker = Container Engine\nKubernetes = Container Orchestrator"
  },
  
  {
    title: "Complete Kubernetes Workflow",
    answer: "Complete Flow:\n\nCode\n→ Dockerfile\n→ Docker Image\n→ Docker Hub\n→ Kubernetes YAML Files\n→ kubectl apply\n→ Deployment Created\n→ Pods Created\n→ Services Created\n→ Application Accessible\n\nKubernetes continuously monitors everything."
  },
  
  {
    title: "Project Structure for Kubernetes",
    answer: "Example project structure:\n\nNoteNova/\n│\n├── back/\n│   ├── Dockerfile\n│   ├── index.js\n│   └── package.json\n│\n├── dash/\n│   ├── Dockerfile\n│   ├── src/\n│   └── package.json\n│\n├── k8s/\n│   ├── backend-deployment.yaml\n│   ├── backend-service.yaml\n│   ├── frontend-deployment.yaml\n│   └── frontend-service.yaml\n│\n└── docker-compose.yml\n\nback = backend project\n\ndash = frontend project\n\nk8s folder contains Kubernetes YAML files."
  },
  
  {
    title: "What Files Are Needed for Kubernetes?",
    answer: "Main Kubernetes files:\n\n1. backend-deployment.yaml\nCreates backend Pods.\n\n2. backend-service.yaml\nExposes backend Pods.\n\n3. frontend-deployment.yaml\nCreates frontend Pods.\n\n4. frontend-service.yaml\nExposes frontend Pods.\n\nDeployment manages Pods.\nService exposes Pods."
  },
  
  {
    title: "What is a Pod?",
    answer: "Pod is the smallest unit in Kubernetes.\n\nA Pod contains:\n- One or more containers\n- Shared network\n- Shared storage\n\nUsually:\n1 Pod = 1 Container\n\nKubernetes manages Pods, not containers directly."
  },
  
  {
    title: "What is a Deployment?",
    answer: "Deployment is used to manage Pods.\n\nDeployment responsibilities:\n- Create Pods\n- Maintain Pod count\n- Auto restart failed Pods\n- Scale Pods\n- Perform rolling updates\n\nDeployment ensures application always remains running."
  },
  
  {
    title: "What is a Service?",
    answer: "Service exposes Pods to network.\n\nPods are temporary.\nPod IP changes frequently.\n\nService provides:\n- Stable IP\n- Stable DNS\n- Load balancing\n- External access"
  },
  
  {
    title: "How Kubernetes Works Internally",
    answer: "Flow:\n\nDeployment\n↓\nReplicaSet\n↓\nPods\n↓\nContainers\n\nService sits in front of Pods and distributes traffic."
  },
  
  {
    title: "Backend Deployment YAML File",
    answer: "File: backend-deployment.yaml\n\nCode:\n\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: backend-deployment\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: backend\n\n  template:\n    metadata:\n      labels:\n        app: backend\n\n    spec:\n      containers:\n      - name: backend\n        image: lavyadav182/notenove-backend:v1\n        ports:\n        - containerPort: 3000"
  },
  
  {
    title: "Backend Deployment YAML Explanation",
    answer: "Explanation:\n\n1. apiVersion\nDefines Kubernetes API version.\n\n2. kind: Deployment\nCreates Deployment object.\n\n3. metadata\nContains deployment name.\n\n4. replicas: 2\nCreates 2 backend Pods.\n\n5. selector\nDeployment identifies Pods using labels.\n\n6. template\nDefines Pod configuration.\n\n7. containers\nDefines container settings.\n\n8. image\nDocker image pulled from Docker Hub.\n\n9. containerPort\nContainer internally uses port 3000."
  },
  
  {
    title: "Backend Service YAML File",
    answer: "File: backend-service.yaml\n\nCode:\n\napiVersion: v1\nkind: Service\nmetadata:\n  name: backend-service\n\nspec:\n  selector:\n    app: backend\n\n  ports:\n    - protocol: TCP\n      port: 3000\n      targetPort: 3000\n      nodePort: 30080\n\n  type: NodePort"
  },
  
  {
    title: "Backend Service YAML Explanation",
    answer: "Explanation:\n\n1. kind: Service\nCreates Service object.\n\n2. selector\nConnects service with backend Pods.\n\n3. port\nService port.\n\n4. targetPort\nActual container port.\n\n5. nodePort\nExternal port accessible from browser.\n\n6. type: NodePort\nExposes backend outside cluster."
  },
  
  {
    title: "Frontend Deployment YAML File",
    answer: "File: frontend-deployment.yaml\n\nCode:\n\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: frontend-deployment\n\nspec:\n  replicas: 2\n\n  selector:\n    matchLabels:\n      app: frontend\n\n  template:\n    metadata:\n      labels:\n        app: frontend\n\n    spec:\n      containers:\n      - name: frontend\n        image: lavyadav182/notenove-frontend:v1\n\n        ports:\n        - containerPort: 3001"
  },
  
  {
    title: "Frontend Service YAML File",
    answer: "File: frontend-service.yaml\n\nCode:\n\napiVersion: v1\nkind: Service\nmetadata:\n  name: frontend-service\n\nspec:\n  selector:\n    app: frontend\n\n  ports:\n    - protocol: TCP\n      port: 3001\n      targetPort: 3001\n      nodePort: 30001\n\n  type: NodePort"
  },
  
  {
    title: "How Kubernetes Pulls Docker Images?",
    answer: "Kubernetes automatically pulls Docker images from Docker Hub.\n\nExample:\n\nimage: lavyadav182/notenove-frontend:v1\n\nKubernetes downloads this image and creates Pods using it."
  },
  
  {
    title: "How to Enable Kubernetes in Docker Desktop?",
    answer: "Steps:\n\n1. Open Docker Desktop\n2. Go to Settings\n3. Open Kubernetes section\n4. Enable:\n   'Enable Kubernetes'\n5. Click Apply & Restart\n\nDocker Desktop creates local Kubernetes cluster automatically."
  },
  
  {
    title: "How to Check Kubernetes Connection?",
    answer: "Run:\n\nkubectl get nodes\n\nIf Kubernetes is connected successfully:\nYou will see node information.\n\nExample:\n\nNAME             STATUS   ROLES           AGE\ndocker-desktop   Ready    control-plane"
  },
  
  {
    title: "What is kubectl?",
    answer: "kubectl is Kubernetes command line tool.\n\nUsed to:\n- Create deployments\n- Create services\n- Check Pods\n- Scale applications\n- Debug applications\n- View logs"
  },
  
  {
    title: "How to Build Docker Images Before Kubernetes?",
    answer: "First build Docker images.\n\nBackend:\n\ndocker build -t lavyadav182/notenove-backend:v1 ./back\n\nFrontend:\n\ndocker build -t lavyadav182/notenove-frontend:v1 ./dash"
  },
  
  {
    title: "How to Push Images to Docker Hub?",
    answer: "Push backend:\n\ndocker push lavyadav182/notenove-backend:v1\n\nPush frontend:\n\ndocker push lavyadav182/notenove-frontend:v1\n\nKubernetes later pulls these images."
  },
  
  {
    title: "Why Docker Hub is Needed for Kubernetes?",
    answer: "Kubernetes needs access to Docker images.\n\nDocker Hub acts like cloud storage for images.\n\nWithout Docker Hub:\nOther machines cannot download images."
  },
  
  {
    title: "How to Apply Backend Deployment?",
    answer: "Go inside k8s folder.\n\nRun:\n\nkubectl apply -f backend-deployment.yaml\n\nKubernetes creates backend Pods."
  },
  
  {
    title: "How to Apply Backend Service?",
    answer: "Run:\n\nkubectl apply -f backend-service.yaml\n\nBackend becomes accessible through network."
  },
  
  {
    title: "How to Apply Frontend Deployment?",
    answer: "Run:\n\nkubectl apply -f frontend-deployment.yaml"
  },
  
  {
    title: "How to Apply Frontend Service?",
    answer: "Run:\n\nkubectl apply -f frontend-service.yaml"
  },
  
  {
    title: "How to Check Deployments?",
    answer: "Run:\n\nkubectl get deployments\n\nShows:\n- Deployment names\n- Replica count\n- Status"
  },
  
  {
    title: "How to Check Pods?",
    answer: "Run:\n\nkubectl get pods\n\nShows all running Pods."
  },
  
  {
    title: "How to Check Services?",
    answer: "Run:\n\nkubectl get services\n\nOR:\n\nkubectl get svc"
  },
  
  {
    title: "How to Access Frontend in Browser?",
    answer: "If using NodePort:\n\nFrontend:\nhttp://localhost:30001\n\nBackend:\nhttp://localhost:30080"
  },
  
  {
    title: "What Happens Internally After kubectl apply?",
    answer: "Flow:\n\n1. YAML sent to Kubernetes API Server\n2. Deployment created\n3. ReplicaSet created\n4. Pods created\n5. Containers started\n6. Service connected\n7. Application becomes accessible"
  },
  
  {
    title: "What is ReplicaSet?",
    answer: "ReplicaSet ensures fixed number of Pods remain alive.\n\nExample:\nreplicas: 2\n\nIf one Pod crashes:\nKubernetes automatically creates another Pod."
  },
  
  {
    title: "What is Auto Healing?",
    answer: "If container crashes:\n- Kubernetes detects failure\n- Removes failed Pod\n- Creates new Pod automatically\n\nThis is called self-healing."
  },
  
  {
    title: "What is Auto Scaling?",
    answer: "Kubernetes can automatically increase/decrease Pods.\n\nExample:\nTraffic increases → More Pods created.\nTraffic decreases → Extra Pods removed."
  },
  
  {
    title: "How to Scale Deployment Manually?",
    answer: "Run:\n\nkubectl scale deployment frontend-deployment --replicas=5\n\nKubernetes creates 5 frontend Pods."
  },
  
  {
    title: "What is Rolling Update?",
    answer: "Rolling Update updates application without downtime.\n\nKubernetes:\n1. Starts new Pods\n2. Gradually removes old Pods\n3. Keeps application online"
  },
  
  {
    title: "How to Update Docker Image in Kubernetes?",
    answer: "Example:\n\nkubectl set image deployment/frontend-deployment frontend=lavyadav182/notenove-frontend:v2\n\nKubernetes performs rolling update automatically."
  },
  
  {
    title: "How to View Logs of Pod?",
    answer: "Run:\n\nkubectl logs pod-name\n\nExample:\n\nkubectl logs frontend-deployment-xxxxx"
  },
  
  {
    title: "How to Enter Inside Pod?",
    answer: "Run:\n\nkubectl exec -it pod-name -- sh\n\nExample:\n\nkubectl exec -it frontend-deployment-xxxxx -- sh"
  },
  
  {
    title: "How to Delete Kubernetes Resources?",
    answer: "Delete deployment:\n\nkubectl delete -f backend-deployment.yaml\n\nDelete service:\n\nkubectl delete -f backend-service.yaml"
  },
  
  {
    title: "How Kubernetes Networking Works?",
    answer: "Kubernetes automatically creates internal networking.\n\nFrontend can call backend using:\n\nhttp://backend-service:3000\n\nNOT localhost.\n\nBecause localhost inside Pod means same Pod only."
  },
  
  {
    title: "How Another User Can Run Your Kubernetes Project?",
    answer: "Another user needs:\n\n1. Docker Desktop\n2. Kubernetes enabled\n3. kubectl installed\n4. YAML files\n5. Docker image access\n\nThen they run:\n\nkubectl apply -f backend-deployment.yaml\nkubectl apply -f backend-service.yaml\nkubectl apply -f frontend-deployment.yaml\nkubectl apply -f frontend-service.yaml"
  },
  
  {
    title: "Difference Between Docker Compose and Kubernetes",
    answer: "Docker Compose:\n- Local development\n- Simple setup\n- Small projects\n\nKubernetes:\n- Production systems\n- Auto scaling\n- Self healing\n- Enterprise-level orchestration"
  },
  
  {
    title: "What Kubernetes Does Automatically?",
    answer: "Kubernetes automatically handles:\n- Container restart\n- Scaling\n- Networking\n- Load balancing\n- Rolling updates\n- Service discovery\n- Self healing\n- Traffic distribution"
  },
  
  {
    title: "Real Kubernetes Flow of Your Project",
    answer: "Your NoteNova project flow:\n\n1. Write backend/frontend code\n2. Create Dockerfiles\n3. Build Docker images\n4. Push images to Docker Hub\n5. Create Kubernetes YAML files\n6. Enable Kubernetes in Docker Desktop\n7. Run kubectl apply commands\n8. Kubernetes creates Deployments\n9. Deployments create Pods\n10. Services expose applications\n11. Users access frontend/backend\n12. Kubernetes continuously manages everything automatically"
  },
  
  {
    title: "Complete Kubernetes Lifecycle",
    answer: "Code\n→ Dockerfile\n→ Docker Image\n→ Docker Hub\n→ Kubernetes Deployment YAML\n→ Kubernetes Service YAML\n→ kubectl apply\n→ Deployment Created\n→ ReplicaSet Created\n→ Pods Created\n→ Services Created\n→ Browser Access\n→ Kubernetes Auto Management"
  }
],

"full-stack":[
  {
    title: "Explain the complete full-stack development workflow from frontend to deployment using Docker and Kubernetes?",
    answer: "Full-stack development is the complete process of building, connecting, deploying, and scaling an application using frontend, backend, database, Docker, cloud deployment, and Kubernetes.\n\nA complete workflow usually follows this order:\n\n1. Frontend Development\n2. Backend Development\n3. Database Integration\n4. API Communication\n5. Authentication\n6. Testing\n7. Deployment\n8. Docker Containerization\n9. Kubernetes Orchestration\n10. Monitoring & Scaling\n\n========================\n1. FRONTEND DEVELOPMENT\n========================\n\nFrontend is the part users interact with.\nIt includes UI, buttons, forms, dashboards, pages, animations, etc.\n\nCommon frontend technologies:\n- HTML\n- CSS\n- JavaScript\n- React.js\n- Material UI / Tailwind CSS\n\nExample:\nA login page with email and password fields.\n\nReact Example:\n\nfunction Login() {\n  return (\n    <div>\n      <input placeholder='Email' />\n      <input placeholder='Password' />\n      <button>Login</button>\n    </div>\n  )\n}\n\nExplanation:\n- User enters credentials.\n- Frontend collects data.\n- Frontend sends request to backend.\n\n========================\n2. BACKEND DEVELOPMENT\n========================\n\nBackend handles:\n- Business logic\n- Authentication\n- Database operations\n- APIs\n- Security\n\nCommon backend technologies:\n- Node.js\n- Express.js\n- Java Spring Boot\n- Django\n\nExample Express Server:\n\nconst express = require('express');\nconst app = express();\n\napp.use(express.json());\n\napp.get('/', (req, res) => {\n  res.send('Server Running');\n});\n\napp.listen(5000);\n\nExplanation:\n- Express creates server.\n- app.get() creates API.\n- Backend listens on port 5000.\n\n========================\n3. DATABASE INTEGRATION\n========================\n\nDatabase stores application data.\n\nCommon databases:\n- MongoDB\n- MySQL\n- PostgreSQL\n\nExample MongoDB User Document:\n\n{\n  username: 'lav',\n  email: 'lav@gmail.com',\n  password: 'hashedPassword'\n}\n\nMongoose Schema Example:\n\nconst userSchema = new mongoose.Schema({\n  username: String,\n  email: String,\n  password: String\n});\n\nExplanation:\n- Schema defines structure.\n- MongoDB stores data in collections.\n- Backend communicates with database.\n\n========================\n4. FRONTEND ↔ BACKEND API CONNECTION\n========================\n\nFrontend sends HTTP requests.\nBackend processes requests and returns response.\n\nExample Axios Request:\n\naxios.post('/login', {\n  email,\n  password\n})\n\nBackend Route Example:\n\nrouter.post('/login', async(req, res) => {\n  const user = await User.findOne({ email: req.body.email });\n  res.json(user);\n});\n\nWorkflow:\nFrontend → API Request → Backend → Database → Response → Frontend\n\n========================\n5. AUTHENTICATION FLOW\n========================\n\nAuthentication verifies user identity.\n\nUsually implemented using:\n- JWT\n- bcrypt\n- Middleware\n\nLogin Workflow:\n\n1. User enters email/password.\n2. Frontend sends login request.\n3. Backend checks user in database.\n4. Password verified using bcrypt.compare().\n5. JWT token generated.\n6. Token sent to frontend.\n7. Frontend stores token.\n8. Protected routes use token.\n\nJWT Example:\n\nconst token = jwt.sign(\n  { id: user._id },\n  process.env.JWT_SECRET,\n  { expiresIn: '7d' }\n);\n\nAuthorization Header Example:\n\nAuthorization: Bearer eyJhbGcOiJIUzI1Ni...\n\nExplanation:\n- Token proves user is logged in.\n- Middleware verifies token before access.\n\n========================\n6. TESTING THE APPLICATION\n========================\n\nTesting checks whether application works correctly.\n\nTypes:\n- Frontend testing\n- Backend API testing\n- Database testing\n\nExample API Test Using Postman:\n\nPOST http://localhost:5000/login\n\nBody:\n{\n  \"email\": \"lav@gmail.com\",\n  \"password\": \"123456\"\n}\n\nExpected Response:\n\n{\n  \"token\": \"jwt_token_here\"\n}\n\nExplanation:\n- APIs are verified before deployment.\n- Errors are fixed locally.\n\n========================\n7. DEPLOYMENT\n========================\n\nDeployment means making app available online.\n\nFrontend deployment platforms:\n- Vercel\n- Netlify\n- Render\n\nBackend deployment platforms:\n- Render\n- Railway\n- AWS EC2\n\nDatabase hosting:\n- MongoDB Atlas\n\nExample:\n\nFrontend:\nhttps://myapp.vercel.app\n\nBackend:\nhttps://myapi.onrender.com\n\nExplanation:\n- Users worldwide can access deployed app.\n- Frontend communicates with live backend.\n\n========================\n8. DOCKER CONTAINERIZATION\n========================\n\nDocker packages application with:\n- Code\n- Dependencies\n- Runtime\n- Environment\n\nPurpose:\n\"Works same on every machine\"\n\nFrontend Dockerfile Example:\n\nFROM node:20\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD [\"npm\", \"start\"]\n\nBuild Docker Image:\n\ndocker build -t frontend-app .\n\nRun Container:\n\ndocker run -p 3000:3000 frontend-app\n\nExplanation:\n- Docker creates isolated environment.\n- Avoids dependency issues.\n- Easy deployment anywhere.\n\n========================\n9. KUBERNETES ORCHESTRATION\n========================\n\nKubernetes manages multiple Docker containers automatically.\n\nIt handles:\n- Scaling\n- Auto-healing\n- Load balancing\n- Deployment management\n\nImportant Kubernetes Components:\n- Pod\n- Deployment\n- Service\n- Ingress\n\nDeployment YAML Example:\n\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: frontend-deployment\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: frontend\n  template:\n    metadata:\n      labels:\n        app: frontend\n    spec:\n      containers:\n      - name: frontend\n        image: lav/frontend:v1\n        ports:\n        - containerPort: 3000\n\nExplanation:\n- replicas: 2 means 2 containers run.\n- If one crashes Kubernetes restarts it.\n- Kubernetes distributes traffic.\n\nService Example:\n\napiVersion: v1\nkind: Service\nmetadata:\n  name: frontend-service\nspec:\n  selector:\n    app: frontend\n  ports:\n  - port: 80\n    targetPort: 3000\n  type: LoadBalancer\n\nExplanation:\n- Service exposes application publicly.\n- LoadBalancer distributes traffic.\n\n========================\n10. COMPLETE REAL-WORLD FLOW\n========================\n\nComplete Workflow:\n\n1. User opens React frontend.\n2. Frontend sends API request.\n3. Backend Express server receives request.\n4. Backend checks MongoDB.\n5. Backend sends response.\n6. JWT token generated after login.\n7. Frontend stores token.\n8. Docker containers package frontend/backend.\n9. Docker images pushed to DockerHub.\n10. Kubernetes deploys containers.\n11. Services expose application.\n12. Users access deployed app globally.\n13. Kubernetes scales app automatically.\n\n========================\n11. COMPLETE TECHNOLOGY FLOW\n========================\n\nFrontend:\nReact + Material UI + Axios\n\n↓\n\nBackend:\nNode.js + Express.js\n\n↓\n\nDatabase:\nMongoDB + Mongoose\n\n↓\n\nAuthentication:\nJWT + bcrypt\n\n↓\n\nDeployment:\nRender / Vercel / AWS\n\n↓\n\nContainerization:\nDocker\n\n↓\n\nOrchestration:\nKubernetes\n\n========================\n12. SIMPLE MIND MAP SUMMARY\n========================\n\nUser\n↓\nFrontend (React)\n↓\nAxios/API Calls\n↓\nBackend (Node + Express)\n↓\nAuthentication (JWT)\n↓\nDatabase (MongoDB)\n↓\nDocker Container\n↓\nDockerHub\n↓\nKubernetes Cluster\n↓\nLoadBalancer Service\n↓\nUsers Access Application\n\n========================\n13. VERY IMPORTANT INTERVIEW UNDERSTANDING\n========================\n\nFrontend = User Interface\nBackend = Logic\nDatabase = Data Storage\nAPI = Communication Bridge\nJWT = Authentication\nDocker = Packaging App\nKubernetes = Managing Containers\nDeployment = Hosting Online\n\n========================\n14. REAL EXAMPLE (YOUR PROJECT TYPE)\n========================\n\nSuppose you build an educational platform:\n\nFrontend:\n- React dashboard\n- Notes page\n- Payment page\n- Video lectures\n\nBackend:\n- Login APIs\n- Purchase APIs\n- Payment verification\n- Batch access control\n\nDatabase:\n- Users\n- Courses\n- Purchases\n- Notes\n\nAuthentication:\n- JWT login system\n\nDeployment:\n- Frontend on Vercel\n- Backend on Render\n- MongoDB Atlas database\n\nDocker:\n- Frontend Docker image\n- Backend Docker image\n\nKubernetes:\n- Deploy multiple backend replicas\n- Auto-restart crashed containers\n- Handle thousands of students\n\nThis is a complete real-world full-stack workflow."
  }
]

};

export default questionsData;


