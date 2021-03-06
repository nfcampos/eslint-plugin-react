/**
 * @fileoverview Prevent usage of setState in componentDidUpdate
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var mode = context.options[0] || 'never';

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {

    CallExpression: function(node) {
      var callee = node.callee;
      if (
        callee.type !== 'MemberExpression' ||
        callee.object.type !== 'ThisExpression' ||
        callee.property.name !== 'setState'
      ) {
        return;
      }
      var ancestors = context.getAncestors(callee).reverse();
      var depth = 0;
      for (var i = 0, j = ancestors.length; i < j; i++) {
        if (/Function(Expression|Declaration)$/.test(ancestors[i].type)) {
          depth++;
        }
        if (
          (ancestors[i].type !== 'Property' && ancestors[i].type !== 'MethodDefinition') ||
          ancestors[i].key.name !== 'componentDidUpdate' ||
          (mode === 'allow-in-func' && depth > 1)
        ) {
          continue;
        }
        context.report(callee, 'Do not use setState in componentDidUpdate');
        break;
      }
    }
  };

};

module.exports.schema = [{
  enum: ['allow-in-func']
}];
