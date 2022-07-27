# Writing Modes and Logical Properties Marking Guide

## Task 1

The student needs to understand to use the `writing-mode` property with a value of `vertical-rl`. Vertical right to left script.

```
.box {
  border: 5px solid rebeccapurple;
  background-color: lightgray;
  padding: 40px;
  margin: 40px;
  writing-mode: vertical-rl;
}
```

## Task 2

The student needs to apply the `inline-size` and `block-size` properties to replace `width` and `height`.

```
.box {
  border: 5px solid rebeccapurple;
  background-color: lightgray;
  padding: 40px;
  margin: 40px;
  inline-size: 200px;
  block-size: 100px;
}
```

## Task 3

This task checks understanding of the logical, flow relative mappings for margin, border and padding physical properties.

```
.box {
  width: 150px;
  height: 150px;
  border-block-start: 5px solid rebeccapurple;
  border-inline-end: 5px solid grey;
  border-block-end: 5px dotted red;
  border-inline-start: 5px dotted blue;
  padding-block-start: 40px;
  margin-block-end: 30px;
}
```
