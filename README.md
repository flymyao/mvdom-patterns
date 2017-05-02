mvdom-patterns is a set of mini applications put together to illustrate some simple but scalable DOM and Javascript Centric patterns to build small to advanced Web applications. YES, simple scale better!


## Concept

- Simple scale better. 
- Patterns outlast frameworks.
- Embrace the DOM, don't fight it. 
- Mega frameworks hardcode patterns, micro frameworks enable them. 
- Frameworks comes and go, runtimes last.

Used right, the DOM does not need much to become a strong foundation for scalable application model. Here are some of those patterns using the mvDom DOM Centric micro-framework (< 12kb).


## Live Demo

http://52.11.174.212:8686/


## Install & build and run

Requirement: node.js >6.x

```
git clone git@github.com:mvdom/mvdom-patterns.git

cd mvdom-patterns
npm install
npm run build
npm start
```

[gulp-free build](https://github.com/mvdom/mvdom-patterns/wiki/gulp-free)

## What's in

- Code structure (simple but scalable). 
    - web/ is the output dir.
    - src/ are the source files to be compiled into web/ folder.
    - src/view structure view components.
    - Three output files app-bundle.js (app code), lib-bundle.js (3rd party lib), all-bundle.css.
- build system
    - gulp / browserify / handlebar compiler / source map.
- App Patterns
    -  Simple but scalable (i.e. distributed) routing system & navigation.
    -  CSS Flexbox app layout.
    -  Simpler "scheduler.js" system to schedule task on a view level or manually. 

## What's next

- Add TodoMVC module (first with a client in memory management).
- Continue dashboard (table content).
- More CSS Flexbox patterns.
    - Form / fields patterns.
    - Continue table layout with flexbox (scrolling, resizing, ...).
- DataService layer (ds.js) with matching mock-server API (for TodoMVC).
