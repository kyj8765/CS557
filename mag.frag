#version 330 compatibility

uniform float uScenter;
uniform float uTcenter;
uniform float uDs;
uniform float uDt;
uniform float uRadius;
uniform float uMagFactor;
uniform float uRotAngle;
uniform float uSharpFactor;
uniform bool uUseCircle;
uniform sampler2D uImageUnit;


in vec2 vST;


void main()
{

	ivec2 ires = textureSize( uImageUnit, 0 );

	float ResS = float( ires.s );
	float ResT = float( ires.t );	
	
	vec2 delta = vST - vec2(uScenter, uTcenter);
	vec2 st = vST;

	bool equation = false;
	if(uUseCircle){
		equation = ((vST.s -uScenter ) *(vST.s -uScenter) + (vST.t -uTcenter)* (vST.t -uTcenter )) <=uRadius ? true: false;
	}
	else{
		equation = ( (uScenter - (uDs/2) < vST.s  ) &&  ( uScenter + (uDs/2) > vST.s ) && (uTcenter - (uDt/2) < vST.t) && (uTcenter + (uDt/2) > vST.t ) == true ? true: false);
	}
	
	float a = uScenter + (sign(uScenter)*abs(uScenter)*(st.s - uScenter)/uMagFactor*cos(uRotAngle) - sign(uTcenter)*abs(uTcenter)*(st.t - uTcenter)/uMagFactor*sin(uRotAngle));
	float b = uTcenter + (sign(uScenter)*abs(uScenter)*(st.s - uScenter)/uMagFactor*sin(uRotAngle) + sign(uTcenter)*abs(uTcenter)*(st.t - uTcenter)/uMagFactor*cos(uRotAngle));
	st =   vec2(a,b);
	vec3 rgb = texture2D( uImageUnit, st ).rgb;

	vec2 stp0 = vec2(1./ResS,  0. );
	vec2 st0p = vec2(0.     ,  1./ResT);
	vec2 stpp = vec2(1./ResS,  1./ResT);
	vec2 stpm = vec2(1./ResS, -1./ResT);

	float i00 =   dot( texture2D( uImageUnit, st ).rgb, vec3(0.2125,0.7154,0.0721) );
	float im1m1 = dot( texture2D( uImageUnit, st - stpp ).rgb, vec3(0.2125,0.7154,0.0721) );
	float ip1p1 = dot( texture2D( uImageUnit, st + stpp ).rgb, vec3(0.2125,0.7154,0.0721) );
	float im1p1 = dot( texture2D( uImageUnit, st - stpm ).rgb, vec3(0.2125,0.7154,0.0721) );
	float ip1m1 = dot( texture2D( uImageUnit, st + stpm ).rgb, vec3(0.2125,0.7154,0.0721) );
	float im10 =  dot( texture2D( uImageUnit, st - stp0 ).rgb, vec3(0.2125,0.7154,0.0721) );
	float ip10 =  dot( texture2D( uImageUnit, st + stp0 ).rgb, vec3(0.2125,0.7154,0.0721) );
	float i0m1 =  dot( texture2D( uImageUnit, st - st0p ).rgb, vec3(0.2125,0.7154,0.0721) );
	float i0p1 =  dot( texture2D( uImageUnit, st + st0p ).rgb, vec3(0.2125,0.7154,0.0721) );

	float h = -1.*im1p1 - 2.*i0p1 - 1.*ip1p1  +  1.*im1m1 + 2.*i0m1 + 1.*ip1m1;
	float v = -1.*im1m1 - 2.*im10 - 1.*im1p1  +  1.*ip1m1 + 2.*ip10 + 1.*ip1p1;
	float mag = sqrt( h*h + v*v );


	if( equation ){
		vec3 target = vec3( mag,mag,mag );
		target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
		target += 2.*(im10+ip10+i0m1+i0p1);
		target += 4.*(i00);
		target /= 16.;
		gl_FragColor = vec4( mix(target, rgb, uSharpFactor), 1. );
	}
	else{
		vec3 frgb = texture2D( uImageUnit, vST ).rgb;
		gl_FragColor = vec4(frgb,1);
	}


}