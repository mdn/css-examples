# Multicol Marking Guide

The aim of the tasks are to demonstrate an understanding of the properties covered in the [Multiple-column Layout](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Multiple-column_Layout) lesson in Learn Web Development on MDN.

## Task 1

This task covers understanding of `column-count` and `column-gap`.

```
.container {
  column-count: 3;
  column-gap: 50px;
}
```

## Task 2

In this task we test for understanding of `column-width`, `column-rule`, and the fact that a rule does not change the size of the gap.

```
.container {
  column-width: 200px;
  column-rule: 5px solid #ccc;
  column-gap: 25px;
}
```

The student has been asked to create columns which will be at least 200 pixels wide, assuming there is space for more than one column. So they will need to use the `column-width` property.

They could use the longhand `column-rule-*` properties instead of the shorthand, though there is no benefit to doing so.

The key thing with the use of `column-gap` is that they have understood that the rule does not add 5px of space to the gap. To have 10px either side of the rule they need a 25px gap as the rule is laid over it.

## Task 3

In this task we test for understanding of the `column-span` property.

All the student needs to do is set the element with a class of `.box` to `column-span: all`. This is mostly a task of checking that they select the right element.

```
.box {
 column-span: all;
}
```
