(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var Crafty = (typeof window !== "undefined" ? window['Crafty'] : typeof global !== "undefined" ? global['Crafty'] : null);

var assets = {
	"images" : "assets/notion_logo.png"
};

Crafty.load(assets, function() {

	Crafty.init();
	Crafty.background('rgb(150,200,255)');
	Crafty.webgl.init();

	var ctx = Crafty.webgl.context
	var dims = { width: ctx.drawingBufferWidth, height: ctx.drawingBufferHeight };
	var size = dims.width/5;


	var logo = Crafty.e('2D, WebGL, Image, Draggable').image('assets/notion_logo.png')
	  // .attr({x: dims.width/2-size/2, y: dims.height/2-size/2, w: size, h: size})


	var info = Crafty.e('2D, Canvas, Text')
							.attr({x: 5, y: dims.height - 15})
							.text("Drag & drop the logo!")
							.textColor('black');



});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
