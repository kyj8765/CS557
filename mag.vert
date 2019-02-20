#version 330 compatibility

uniform float uScenter;
uniform float uTcenter;
uniform float uDs;
uniform float uDt;
uniform float uMagFactor;
uniform float uRotAngle;
uniform float uSharpFactor;


out vec2 vST;


void main( )
{

	vST = gl_MultiTexCoord0.st;
	gl_Position = gl_ModelViewProjectionMatrix *gl_Vertex; 

}