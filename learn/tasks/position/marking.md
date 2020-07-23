# Floats Marking Guide

The aim of the tasks are to demonstrate an understanding of the properties covered in the [Positioning](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning) lesson in Learn Web Development on MDN.

## Task 1

This task covers understanding of `position: relative` and `position: absolute` and how they relate to each other in terms of relative positioning creating a new positioning context.

```
.container {
  position: relative;
}

.target {
  position: absolute;
  top: 0;
  right: 0;
} 
```

A likely issue will be that the student adds `position: absolute` to the child but does not apply `position: relative` to the container. In that case the target will end up being positioned according to the viewport.

For the extra task, the student needs to add a negative `z-index` to the target, for example `z-index: -2`.

## Task 2

In task 2 we check understanding of `position: fixed` with a slightly different example to that in the materials using a sidebar.

```
.sidebar {
  position: fixed;
}
```
