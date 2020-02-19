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
