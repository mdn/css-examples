# Marking Guide for image and forms tasks

## Task 1 object-fit

The student has been asked to make the image fill the box, retaining aspect ratio. It has been explained that it is ok if some parts of the image are therefore cropped. Using `object-fit: cover` is the correct choice, they also need to set the width and height to 100%;

```
img {
 height: 100%;
 width: 100%;
 object-fit: cover;
}
```

## Task 2 styling simple form elements

The student has been asked to perform various tasks to style a form field and submit button.

- Using attribute selectors to target the search field and button inside .myform.
- Make the form field use the same text size as the rest of the form.
- Give the form field and button 10 px of padding.
- Make the button also use the same font size as the rest of the form.
- Give the button a purple background, white foreground, no border and rounded corners of 5px.

```
.myform {
  border: 2px solid #000;
  padding: 5px;
}

.myform input[type="search"] {
  padding: 10px;
  font-size: inherit;
}

.myform input[type="submit"] {
  padding: 10px;
  font-size: inherit;
  background-color: rebeccapurple;
  color: white;
  border: 0;
  border-radius: 5px;
}    
```
