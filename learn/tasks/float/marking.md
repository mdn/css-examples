# Floats Marking Guide

The aim of the tasks are to demonstrate an understanding of the properties covered in the [Float](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Floats) lesson in Learn Web Development on MDN.

## Task 1

This task covers understanding of the basic float property, and the values `left` and `right`. The following should be all they need to do.

```
.float1 {
  float: left;
}

.float2 {
  float: right;
}
  
```

## Task 2

In task 2 we check that the student understands how to clear an element from a floated item. They need to flow the item left, then add `clear: left` to the class for the second paragraph.

```
.float {
  float: left;
}

.below {
  clear: left;
}
```

## Task 3

In the final task the student is asked to use the most up to date method of clearing the box underneath the floated item. Therefore they should add `display: flow-root` to the class for `.box`. Other methods might be to use `overflow` or a clearfix hack, however the learning materials detail the `flow-root` method as the modern way to achieve this.

```
.box {
  display: flow-root;
}
```
