(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var Crafty = (typeof window !== "undefined" ? window['Crafty'] : typeof global !== "undefined" ? global['Crafty'] : null);

Crafty.init();
Crafty.background('rgb(150,200,255)');

Crafty.e('2D, WebGL, Color, Draggable')
	.color(255, 255, 255, 1)
  .attr({x: 13, y: 37, w: 50, h: 50})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
