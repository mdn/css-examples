# Background and Borders Marking Guide

The aim of the tasks are to demonstrate an understanding of the properties covered in the [Background and Borders](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Backgrounds_and_borders) lesson in Learn Web Development on MDN.

## Task 1

This task covers understanding of `border`, `border-radius`, `background-image`, and `background-size`. Also, it checks that the student understands how to use RGBa colors to make a background color partly transparent.

```
.box {
  border: 5px solid #000;
  border-radius: 10px;
  background-image: url(balloons.jpg);
  background-size: cover;
}

h2 {
  background-color: rgba(0,0,0,.5);
  color: #fff;
}
```

The student could use the individual border longhands however this is unecessarily verbose as all borders are set to the same color, style and size.

## Task 2

In task 2 the student will need to use and position multiple background images using the `background` shorthand. This tests their understanding of the shorthand and also of the ability to use more than one background image.

We also ask them to round only some of the corners on the border, ensuring they understand how to use individual `border-radius` properties.

There are also some elements which link back to earlier lessons:

- They need to add padding to the heading in order that it doesn't overlay the star image - this links back to learning from the earlier Box Model lesson.
- The text with be aligned with the `text-align` property.

```
.box {
  border: 5px solid lightblue;
  border-top-left-radius: 20px;
  border-bottom-right-radius: 40px;
}

h2 {
  padding: 0 40px;
  text-align: center;
  background: url(star.png) no-repeat left center,
    url(star.png) repeat-y right center;
}
```
