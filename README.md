# RSNBATWPL

RSNBATWPL, or Radvylf Should Not Be Allowed To Write Programming Languages, is a "practical" programming language designed by Radvylf Programs. Because the name is a bit difficult to type and say, you'll see it referred to with varying names, including "rSN" or "raisin-batwaffle". RSNBATWPL was designed to put readability first, capability second, and security third. It takes inspiration from a wide array of languages, including PHP, C++, JS, FORTRAN, and Haskell.

## Intro

RSNBATWPL, on the surface, is a pretty ordinary and uncursed language. There's nothing particularly wacky about it at first glance, aside from its slightly unconventional syntax, as can be demonstrated by this FizzBuzz program:

    n = cast.int{input{"Input: "}};

    for {i = 1; i <= n; ++$i} {
        cond {(i % 3) and (i % 5)} {
            print{i};
        } {
            s = "";

            if {not{i % 3}} {
                s += "Fizz";
            };

            if {not{i % 5}} {
                s += "Buzz";
            };

            print{s};
        };
    };
    
This will document the reasonable parts of the rSN language, and serve as a tutorial for using it. You can figure out the rest, especially all of its parsing oddities and cursed behavioral quirks, yourself.

## Installation

Installing rSNBATWPL may just be a thing which you can do today, and not yesterday. There are three ways to install it to your local (or global) machine:

1. Download a .zip of this repository
2. Install the `rsnbatwpl` NPM package
3. Reimplement the core language features yourself

You can also use the online interpreter: https://radvylf.github.io/rSNBATWPL/rsnbatwpl.html

## Basics

Run `node rsnbatwpl-cli.js` or go to the online interpreter. This will put you in a RRPL (Read-Run-Print-Loop). Try the following:

    print{"Hello, World!"};
    
Congrats! You just wrote a Hello, World program in raisin-batwaffle. You can also play around with math and strings. Try the following:

    1 + 1
    2.0 - 1.1
    4 * 1.5
    "xyz"
    'a
    'a 'b
    "string 1" "string 2"
    "s" * 2

You'll notice rSN has two number types, floats and ints. Floats are 64-bit. String literals have two syntaces, `"abc"` and `'a`, and string literals adjacent to one another are concatenated. The following basic arithmetic operators are implemented in raisin: `+`, `-`, `*`, `/`, `%`, and `**`.

## Variables

Raisin-batwaffle's variables, taking inspiration from Python, are set with `=`, and need no declaration. For example, `name = "Radvylf"`, or `age = 17`. You may use these variables in any situation you can use a literal. You may access a variable using a string with the `var` function, as in `var{"name"}`.

## Syntax

Rsnbatwpl requires a `;` after every statement. Note that, unlike most languages, arguments to control flow operators like `if` and `for` require semicolons, and the lack of these will cause parsing issues. Speaking of parsing, RSN does not use operator precedence. Instead, all parsing of infix operators is done right-to-left, meaning `1 + 2 * 2` is `5` and `2 * 2 + 1` is `6`. Functions and built-ins, including built-ins like `while`, are called using `{}` for each argument. For example, a function `add` could take arguments `1` and `2.2` with `add{1}{2.2}`. Note that you can store a partially-called function. For example, `add1 = add{1}` would make `add1` a unary function which increments its argument. Note that infix operators are also functions, and in fact are called identically. Both `+{1}{2}` and `(condition) while (body)` would be valid, though unconventional, syntax.

## Control flow

RSN takes a novel approach to bools. In order to enhance readability, it uses english contractions. The "default" truthy boolean is `do`, and its falsy equivalent is `don't`. You might notice, RSNBATWPL supports single quotes in identifiers, a much-loved feature taken from Haskell (unfortunately they only had one in stock so you can no longer make use of this in Haskell). Other contractions supported include, but are not limited to: `can`, `should`, `did`, `is`, `was`, and `will`. There's also a wacky evil twin of `don't`, `no`, and its truthy equivalent, `non't`.

Some basic bool operators include `and` and `or`, which are infix as you would expect, and `not`, which is a function and looks like `not{don't}`. Control flow functions you may use with bools include `if`, `cond`, `while`, and `do-while`.

## Identifiers

You can store a reference to a variable using an `id`. For example, `id{"add1"}` would store a reference to our `add1` function, which can be passed around and used in any context. You can change the value of `add1` with `id{"add1"} = ...`, or if you have the `id` stored with something like `b = id{"add1"}`, `(b) = ...` (note that `b = ...` would just change `b`). There are also un-scoped identifiers, made with `nscopd-id`, which will use the context of whatever function they are being used in (any two `nscopd-id`s with the same variable name are interchangeable). You can dereference an id with `@`.

## Arrays

Now it's time to talk about arrays. There is no array literal syntax. However, the infix operator `,` behaves quite similarly to one. `(1, 2)` will be parsed as the array `(1, 2)`, and `(1, 2, 4)` will be `(1, 2, 4)`. In other words, it's an array literal syntax, but with slightly different inner workings than the other literals. You can take the `n`th item from an array `a` with `a{n}`, the same syntax used to call functions. Various built-ins are available for working with arrays (and strings), including `size`, `filt`, `find`, `findpos`, `rdc`, `sort`, `flip`, `rvr`, `sto`, `sfro`, `split`, `squish`, `crush`, and `squish-with`.

Note that loops will return arrays.

## Functions

Functions use `~`, in place of `->` or `=>` in most languages. For example, a function which adds `2` to a number would look like `x ~ x + 2`. Since functions use currying, a two-arg function would look like `x ~ y ~ x + y`.

## Important built-ins

Some other important built-ins include:

- `==` and `!!`, for equality
- `~~` and `!`, for looser equality
- `cmp`, `<`, `>`, `<=`, and `>=`, for comparison
- `ncon`, `con`, and `conc`, for building arrays
- `+=`, `-=`, `*=`, `/=`, and `%=`, for doing various binary operations in-place
- `++` and `--`, for incrementing and decrementing
- `_`, for negating a number
- `input` and `print`, for I/O
- `type` and `cast.*` for working with different types
- `dbg`, `dbg.data`, and `dbg.pars` for debugging
- Various math operators including `floor`, `sin`, `atan2`, and `random`

## Security

Many existing languages have a rather nasty vulnerability: badly written code, or good code working under unexpected conditions, will error, and stop working. This can lead to a loss of profit, and other bad things. RSNBATWPL solves this, by ensuring that nothing will ever error.
