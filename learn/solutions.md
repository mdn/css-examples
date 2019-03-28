# Task Solutions

Solutions for the tasks in the CSS Learn section of MDN.

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