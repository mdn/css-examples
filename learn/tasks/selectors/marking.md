# Selectors Marking Guide

This marking guide is for the tasks on the Selectors pages and subpages in the CSS Building Blocks section of Learn.

## Task 1: Type selectors

The student needs to target the h1, h2 and span selectors to change their color or size.

```
h1 {
  color: blue;
}

h2 {
  background-color: blue;
  color: white;
}

span {
  font-size: 200%;
}
```

## Task 2: class and id selectors

This tests that the student understands he different between these and also how to target multiple classes on an item.

```
#special { 
  background-color: yellow;
}

.alert {
  border: 2px solid grey;
}

.alert.stop {
 background-color: red;
}

.alert.go {
  background-color: green;
}
```

## Task 3: Pseudo-classes and pseudo-elements

Here we ask the student to apply a pseudo-class (:first-child) and pseudo-element (::first-line) to a piece of content.

We also ask them to style the `:link`, `:visited`, and `:hover` states of the `a` element, and the created striped table rows using the `:nth-child` pseudo-class.

```
.container p:first-child {
  font-size: 150%;
}

.container p:first-child::first-line {
  color: red;
}

a:link {
  color: orange;
}

a:visited {
  color: green;
}

a:hover {
  text-decoration: none;
}

tr:nth-child(even) {
  background-color: #333;
  color: #fff;
}
```

## Task 4: Combinators

This task checks that the student understands how to use the different combinators. They are asked to make paragraphs that dirctly follow an `h2` red, and to remove the list bullets and add a bottom border only for the direct children of the ul with a class of `.list`.

```
h2 + p {
  color: red;
}

.list > li {
  list-style: none;
  border-bottom: 1px solid #ccc;
}
```

## Task 5: attribute selectors

The student is asked to target the `<a>` element with a title attribute and make the border pink (`border-color: pink`).

To select elements with a title attribute we can add title inside the square brackets, which will select the second link, which is the only one with a title attribute.

```
a[title] {
  border-color: pink;
}
```

Target the <a> element with an href attribute which contains the word contact anywhere in its value and make the border orange (border-color: orange).

There are two things we want to match here, the href value "/contact" and also "../contact". So we need to match the string "contact" anywhere in the value using *=. This will select the third and fourth links.

```
a[href*="contact"] {
  border-color: orange;  
}
```

Target the <a> element with an href value starting with https and give it a green border (border-color: green).

Here we can look for an href value which starts with "https" and so use ^=, this will only select the first link.

```
a[href^="https"] { 
  border-color: green;
}
```

