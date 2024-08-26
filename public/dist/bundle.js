/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/app.js":
/*!**************************!*\
  !*** ./public/js/app.js ***!
  \**************************/
/***/ (() => {

eval("function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _iterableToArray(r) { if (\"undefined\" != typeof Symbol && null != r[Symbol.iterator] || null != r[\"@@iterator\"]) return Array.from(r); }\nfunction _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\ndocument.addEventListener('DOMContentLoaded', function () {\n  var skills = document.querySelector('.lista-conocimientos');\n\n  //! Limpiar las alertas\n  var alertas = document.querySelector('.alertas');\n  if (alertas) {\n    limpiarAlertas();\n  }\n  if (skills) {\n    skills.addEventListener('click', agregarSkils);\n    //! Una vez que estamos en editar llamar la funcion\n    skillSeleccionados();\n  }\n});\nvar skillsPrototype = new Set();\nvar agregarSkils = function agregarSkils(e) {\n  if (e.target.tagName === 'LI') {\n    if (e.target.classList.contains('activo')) {\n      skillsPrototype[\"delete\"](e.target.textContent);\n      e.target.classList.remove('activo');\n    } else {\n      skillsPrototype.add(e.target.textContent);\n      e.target.classList.add('activo');\n    }\n  }\n  var skillsArray = _toConsumableArray(skillsPrototype);\n  document.querySelector('#skills').value = skillsArray;\n};\nvar skillSeleccionados = function skillSeleccionados() {\n  var selsccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));\n  selsccionadas.forEach(function (seleccionada) {\n    skillsPrototype.add(seleccionada.textContent);\n  });\n  //! Inyectarlo en el hidden\n  var skillsArray = _toConsumableArray(skillsPrototype);\n  document.querySelector('#skills').value = skillsArray;\n};\nvar limpiarAlertas = function limpiarAlertas() {\n  var alertas = document.querySelector('.alertas');\n  var interval = setInterval(function () {\n    if (alertas.children.length > 0) {\n      alertas.removeChild(alertas.children[0]);\n    } else if (alertas.children.length === 0) {\n      alertas.parentElement.removeChild(alertas);\n      clearInterval(interval);\n    }\n  }, 1500);\n};\n\n//# sourceURL=webpack://devjobs/./public/js/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/js/app.js"]();
/******/ 	
/******/ })()
;