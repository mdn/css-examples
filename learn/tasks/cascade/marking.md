# Cascade and inheritance marking guide

## Task 1

One possible solution is as follows:

```
#outer #inner a {
  background-color: initial;
}
```

There are two things the student needs to do in this task. First, write a selector for the `a` element which is more specific than the selector used to turn the background blue. In this solution, this is achieved by using the `id` selector which has very high specificity.  

Then the student needs to remember there are special keyword values for all properties. In this case, using `inherit` sets the background color back to be the same as its parent element.

## Task 2

One possible solution is as follows:

```
 @layer yellow, green, purple;
```

