// Add YAML lint support to CodeMirror. Submitted pull request #2266
// Depends on scripts-yaml.scripts from https://github.com/nodeca/scripts-yaml

// declare global: jsyaml

CodeMirror.registerHelper("lint", "yaml", function(text) {
  var found = [];
  try { jsyaml.load(text); }
  catch(e) {
      var loc = e.mark;
      found.push({ from: CodeMirror.Pos(loc.line, loc.column), to: CodeMirror.Pos(loc.line, loc.column), message: e.message });
  }
  return found;
});
CodeMirror.yamlValidator = CodeMirror.lint.yaml; // deprecated
