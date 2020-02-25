# Box Model Marking Guide

## Task 1

In this task the student needs to know that when using the alternate box model, the width is the size of the total of content, padding and border. Therefore to make it match the standard box model example they need to set the width to 390px.

```
.alternate {
  box-sizing: border-box;
  width: 390px;
}
```

## Task 2

This task involves the student using the margin, border and padding properties correctly. They might choose to use the longhand properties instead however in particular when setting the padding to all sides, the shorthand is probably the better choice.

```
.box {
  border: 5px dotted black;
  margin: 20px 1em 40px 2em;
  padding: 1em;
}
```

## Task 3

In this task the student needs to know that by using `display: inline-block` the block direction margin, border and padding will cause the other lines to be pushed away from the element.

```
.box span {
  background-color: pink;
  border: 5px solid black;
  padding: 1em;
  display: inline-block;
}
```
