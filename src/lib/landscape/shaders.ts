const noise = /* glsl */ `
float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * .1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
float field(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
             mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);
}
float fbm(vec2 p) {
  mat2 turn = mat2(.84,.54,-.54,.84);
  return field(p)*.55 + field(turn*p*2.05)*.27
    + field(p*4.12+17.)*.12 + field(turn*p*8.3)*.06;
}
`;

const uniforms = /* glsl */ `
uniform vec3 sun;
uniform vec2 glowCenter;
uniform float lakeLevel, reflecting;
uniform float warmth, exposure, sunlight, ambient, fog, mist, shadows, daylight, night;
uniform float cloudDensity, clock, aspect, snowline, snowSlope, detail;
vec3 finish(vec3 color) {
  return 1. - exp(-max(color,0.) * exposure);
}
`;

export const skyVertex = /* glsl */ `
varying vec2 screen;
void main() {
  screen = position.xy;
  gl_Position = vec4(position.xy, 1., 1.);
}
`;

export const skyFragment = /* glsl */ `
${noise}
${uniforms}
varying vec2 screen;
void main() {
  float y = screen.y*.5+.5;
  vec3 ray = normalize(vec3(screen.x*aspect*.31, screen.y*.31+.02,-1.));
  float toward = max(dot(ray,vec3(sun.xy,-sun.z)),0.);
  float horizon = exp(-max(y-.31,0.)*3.15);
  vec3 zenith = mix(vec3(.032,.029,.092),vec3(.095,.28,.58),daylight);
  vec3 edgeSky = mix(vec3(.64,.225,.093),vec3(.56,.69,.79),daylight);
  zenith = mix(zenith,vec3(.003,.009,.029),night);
  edgeSky = mix(edgeSky,vec3(.022,.035,.074),night);
  vec3 sky = mix(zenith,edgeSky,horizon);
  sky += vec3(.59,.23,.074)*exp(-pow((y-.29)*4.,2.))
    *(.23+pow(toward,3.))*(1.-daylight)*(1.-night);
  vec2 starCell = vec2(screen.x*aspect,screen.y)*120.;
  float star = step(.993,hash(floor(starCell))) * (1.-smoothstep(.035,.16,length(fract(starCell)-.5)));
  sky += vec3(.54,.66,.9)*star*night*smoothstep(.38,.62,y);
  vec2 toSun = vec2((screen.x-glowCenter.x)*aspect*.5,y-glowCenter.y);
  float sunDistance = length(toSun);
  float visibleSun = 1.-night;
  sky += vec3(1.,.36,.085)*exp(-sunDistance*7.)*visibleSun*(1.-daylight);
  vec2 p = vec2(screen.x*aspect*3.8 + clock, y*18. + screen.x*2.5);
  p += vec2(fbm(p*.38+12.),fbm(p*.49-8.))*1.92;
  float bands = fbm(p);
  float density = smoothstep(.40,.67,bands) * smoothstep(.31,.58,y);
  float edge = clamp((bands-fbm(p+vec2(.1,.25)))*2.5+.35,0.,1.);
  vec3 cloud = mix(vec3(.105,.045,.125),vec3(1.32,.42,.15),clamp(edge*(horizon+exp(-sunDistance*2.2))*.88,0.,1.));
  cloud = mix(cloud,mix(vec3(.28,.38,.55),vec3(.73,.78,.83),edge),daylight);
  cloud = mix(cloud,vec3(.012,.02,.044),night);
  sky = mix(sky,cloud,density*cloudDensity);
  float disc = 1.-smoothstep(.008,.012,sunDistance);
  sky += vec3(4.4,2.05,.83)*disc*visibleSun;
  sky += vec3(1.8,.65,.18)*exp(-sunDistance*50.)*visibleSun;
  float bearing = atan(toSun.y,toSun.x+.00001);
  float rays = pow(abs(cos(bearing*3.+.4)),34.)*exp(-sunDistance*27.);
  sky += vec3(.83,.34,.095)*rays*visibleSun*(1.-daylight);
  gl_FragColor = vec4(finish(sky),1.);
}
`;

export const compositeFragment = /* glsl */ `
uniform sampler2D terrainLayer, skyLayer, reflectionLayer;
uniform float clock, horizonLine;
varying vec2 screen;
void main() {
  vec2 uv = screen*.5+.5;
  vec4 land = texture2D(terrainLayer,uv);
  vec2 skyUV = vec2(.5 + screen.x*.449 + sin(clock)*.046,uv.y);
  vec3 sky = texture2D(skyLayer,skyUV).rgb;
  vec3 color = land.rgb + sky*(1.-land.a);
  if (land.a > .4 && land.a < .6) {
    // Ripple displacement increases toward the foreground while the
    // shoreline stays in place. The reflected ridges come from the mesh.
    float depth = clamp((horizonLine-uv.y)*2.3,0.,1.);
    float wave = sin(uv.y*235.+sin(uv.x*39.+clock*19.)*1.7+clock*92.);
    float fine = sin(uv.y*410.-uv.x*67.+clock*128.);
    vec2 ripples = vec2(wave*.0022,fine*.0014) * (.23+.77*depth);
    vec2 reflectedUV = clamp(uv+ripples,0.,1.);
    vec4 mirror = texture2D(reflectionLayer,reflectedUV);
    vec2 reflectedSkyUV = vec2(skyUV.x+ripples.x,2.*horizonLine-reflectedUV.y);
    vec3 reflectedSky = texture2D(skyLayer,clamp(reflectedSkyUV,0.,1.)).rgb;
    float fresnel = mix(.85,.60,depth);
    vec3 water = mirror.rgb + reflectedSky*(1.-mirror.a);
    color = mix(vec3(.007,.011,.021),water,fresnel) * (1.+wave*.035);
  }
  gl_FragColor = vec4(color,1.);
  #include <colorspace_fragment>
}
`;

export const landVertex = /* glsl */ `
attribute float sunVisibility;
uniform float reflecting, lakeLevel;
varying vec3 world, surfaceNormal;
varying float visibility;
void main() {
  world = position;
  surfaceNormal = normal;
  visibility = sunVisibility;
  vec3 shape = position;
  shape.y = mix(position.y,2.*lakeLevel-position.y,reflecting);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(shape,1.);
}
`;

export const landFragment = /* glsl */ `
${noise}
${uniforms}
varying vec3 world, surfaceNormal;
varying float visibility;
void main() {
  if (reflecting > .5 && world.y < lakeLevel) discard;
  vec3 normal = normalize(surfaceNormal);
  vec2 p = world.xz;
  float fold = fbm(p * vec2(1.35,1.7) + vec2(world.y*.63,0.));
  float stone = fbm(p*5.1 + world.y*vec2(2.7,1.6));
  vec2 bent = vec2(p.x*1.7+world.y*2.8,p.y*.9+world.y*1.25);
  bent += vec2(fbm(p*.9+25.),fbm(p*.72-14.))*2.6;
  float strata = field(bent);
  float dust = mix(fold,stone,.38);
  float exposureSlope = normal.y + (fold-.5)*.53 + (strata-.5)*.24 + normal.x*.11;
  float altitude = smoothstep(snowline-1.25,snowline+1.85,world.y+(fold-.5)*1.8);
  float snow = smoothstep(snowSlope-.10,snowSlope+.10,exposureSlope)*altitude;
  snow *= 1. - smoothstep(.65,.84,strata)*.36*detail;
  float timber = 1.-smoothstep(.7,2.3,world.y);
  vec3 rock = mix(vec3(.026,.035,.062),vec3(.23,.225,.232),dust);
  rock = mix(rock,rock*vec3(.46,.64,.77),timber);
  vec3 ice = mix(vec3(.26,.36,.54),vec3(.87,.87,.91),stone);
  vec3 material = mix(rock,ice,snow);
  // Fine strata disturb the lighting without changing the skyline.
  vec3 grit = vec3(stone, field(p*5.8+32.), field(p*7.2-19.)) - .5;
  vec3 broken = normalize(normal + grit * .28 * detail);
  float diffuse = max(dot(broken,sun),0.);
  float visible = mix(1.,clamp(visibility,0.,1.),shadows);
  float low = smoothstep(1.35,5.8,world.y);
  vec3 key = mix(vec3(1.,.93,.85),vec3(1.8,.54,.19),warmth);
  vec3 fill = vec3(.16,.27,.46) * ambient * (.54+.46*normal.y);
  float shoreDust = (1.-smoothstep(lakeLevel+.13,lakeLevel+.57,world.y))
    * smoothstep(.30,.63,fold) * smoothstep(.58,.89,normal.y);
  material = mix(material,vec3(.28,.24,.28),shoreDust*.72);
  vec3 color = material * (fill + key * sunlight * diffuse * visible * mix(mix(.15,1.,low),1.,daylight));
  color += vec3(.16,.105,.132)*shoreDust*(1.-night)*(.8+.2*daylight);
  float distanceToEye = length(cameraPosition-world);
  float haze = 1.-exp(-fog*max(distanceToEye-11.,0.));
  float valleyMist = mist * exp(-max(world.y,0.)*.59)
    * smoothstep(10.,29.,distanceToEye) * (.55+.45*field(p*.24+vec2(clock*.31,0.)));
  vec3 air = mix(vec3(.055,.1,.17),vec3(.26,.24,.3),smoothstep(18.,58.,distanceToEye));
  air = mix(air,vec3(.23,.36,.54),daylight*.58);
  air = mix(air,vec3(.012,.024,.056),night);
  color = mix(color,air,clamp(haze*(.66-.24*smoothstep(3.,7.,world.y))+valleyMist,0.,.85));
  gl_FragColor = vec4(finish(color),1.);
  #include <colorspace_fragment>
}
`;

// The terrain target stores land, clear sky and the depth-tested water mask.
export const waterVertex = /* glsl */ `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
}
`;

export const waterMaskFragment = /* glsl */ `
void main() {
  gl_FragColor = vec4(0.,0.,0.,.5);
}
`;
