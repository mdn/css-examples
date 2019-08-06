# Task Solutions

Solutions for the tasks in the CSS Learn section of MDN.

## The Cascade

[Task](https://developer.mozilla.org/en-US/docs/User:chrisdavidmills/CSS_Learn/Cascade_and_inheritance#Active_learning_playing_with_the_cascade)

Task: Write a declaration in a new rule that will reset the background color back to white, without using an actual color value?

One possible solution is as follows:

```
#outer #inner a {
  background-color: initial;
}
```

There are two things you need to do in this task. First, you need to write a selector for the `a` element which is more specific than the selector used to turn the background blue. I have achieved this by using the `id` selector which has very high specificity. 

Then you need to remember that there are special keyword values for all properties. In this case I am using `inherit` to set the background back to be the same as its parent element.

## Attribute Selectors

[Task](https://developer.mozilla.org/en-US/docs/User:chrisdavidmills/CSS_Learn/CSS_Selectors/Attribute_selectors#Try_it_out)

Task: Target the `<a>` element with a title attribute and make the border pink (border-color: pink).

To select elements with a title attribute we can add `title` inside the square brackets, which will select the second link, which is the only one with a title attribute.

```
a[title] {
  border-color: pink;
}
```

Target the `<a>` element with an href attribute which contains the word contact anywhere in its value and make the border orange (border-color: orange).

There are two things we want to match here, the href value "/contact" and also "../contact". So we need to match the string "contact" anywhere in the value using `*=`. This will select the third and fourth links.

```
a[href*="contact"] {
  border-color: orange;  
}
```

Target the `<a>` element with an href value starting with https and give it a green border (border-color: green).

Here we can look for an href value which starts with "https" and so use `^=`, this will only select the first link.

```
a[href^="https"] { 
  border-color: green;
}
```

## The Box Model

[Task](https://developer.mozilla.org/en-US/docs/User:chrisdavidmills/CSS_Learn/The_Box_Model#Playing_with_box_models)

Task: Change the size of the second box (by adding CSS to the .alternate class) to make it match the first box in width and height.

```
.alternate {
  box-sizing: border-box;
  width: 390px;
  height: 240px;
}
```

You will need to increase the height and width of the second block, to add the size of the padding and border.

## Backgrounds and Borders

To style the box we add a border, using the `border` property. Round the corners with `border-radius` and then add the background image setting the size to `contain`.

```
.box {
  border: 5px solid #000;
  border-radius: 10px;
  background-image: url(balloons.jpg);
  background-size: contain;
}
```

I used rgba colors to add a background color to the heading which is semi-transparent.

```
h2 {
  background-color: rgba(0,0,0,.5);
  color: white;
}
```
