# Flexbox Tasks Marking Guide

## Flex Layout One

The aim of this task is to show understanding of the default behavior of Flexbox, and how you do not need to do a lot of work to acheive many patterns.

To solve this task the student needs to use `display: flex` on the parent, and also `justify-content: space-between`. They do not need to use the `flex` property or any of the longhands on the children, as the defaults will cause them to display auto sized and not grow to fill the inline dimension.

```
nav ul {
  display: flex;
  justify-content: space-between;
}
```

## Flex Layout Two

The aim of this task is to demonstrate an understanding of the `flex` property, and in particular the way that `flex-basis` works.

It would be correct for the student to have used `flex: 1` on the `li` or `flex: 1 0 0`, or `flex: 1 1 0`. The key thing is that they have set the `flex-basis` to `0`. It would also be correct to use the longhands, for example:

```
flex-grow: 1;
flex-shrink: 0;
flex-basis: 0;
```

However as the specification advises use of the shorthands, in this scenario `flex: 1` is probably the best answer of all of these, and so the most optimal result would be:

```
ul {
  display: flex;
}

li {
  flex: 1;
}
```

### Additional question

The student should add an additional selector that targets the first element and sets `flex: 2;` (or `flex: 2 0 0;` or `flex-grow: 2`):

```
li:first-child {
  flex: 2;
}
```

## Flex Layout Three

Here we use Flexbox to center an item horizontally and vertically. The aim of this task is to demonstrate the student has an understanding of how to use the alignment properties to achieve this.

On the parent they should use:

```
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## Flex Layout Four

This example demonstrates understanding of the `flex-wrap` property to wrap flex lines. In addition, to ensure that they end up with something that looks like the example they need to set `flex: auto` on the child (or `flex: 1 1 auto;`).

```
ul {
  display: flex;
  flex-wrap: wrap;
}

li {
  flex: auto;
}
```
