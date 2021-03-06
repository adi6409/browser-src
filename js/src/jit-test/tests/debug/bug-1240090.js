gczeal(2);
g = newGlobal({newCompartment: true, disableLazyParsing: true});
dbg = Debugger(g);
dbg.onNewScript = function() { return function() { return this; } };
schedulegc(10);
g.evaluate("function one() {}");
g.evaluate(`
           function target () {}
           function two2() {}
           `, {});
g.evaluate(`
           function three1() {}
           function three2() {}
           function three3() {}
           `, {});
dbg.memory.takeCensus({
  breakdown: {
    by: "coarseType",
    scripts: {
      by: "filename"
    }
  }
});
