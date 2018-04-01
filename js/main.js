$(document).ready(function(){
  var app;
  var pixiViewport = $('#intro');
  var imageScale = 1;
  var loadCount = 0;
  var layers = [
  'dist/img/channels/4/c.jpg',
  'dist/img/channels/4/m.jpg',
  'dist/img/channels/4/y.jpg',
  'dist/img/channels/4/k.jpg'
  ];
  var containers = [];
  var filters = [];
  var sprites = [];
  var maps = 'dist/img/maps/2.jpg';
  var displacementSprite = new PIXI.Sprite.fromImage(maps);
  var s1 = randomScale();
  var s2 = randomScale();
  var s3 = randomScale();
  var s4 = randomScale();

  function appSetup(){
    app = new PIXI.Application({
      resolution: 1,
      antialias: true,
      backgroundColor: 0xffffff
    });
    app.renderer.autoResize = true;
    pixiViewport.append(app.view);
    appResizeRenderer();
    appLoadLayers();
  }
  appSetup();

  function appLoadLayers(){
    PIXI.loader.add(layers[loadCount]).load(function(){
      //sprite
      layer = new PIXI.Sprite(PIXI.loader.resources[layers[loadCount]].texture);
      layer.anchor.set(.5);
      layer.x = pixiViewport.innerWidth()/2;
      layer.y = pixiViewport.innerHeight()/2;
      appResizeLayer(layer);
      sprites.push(layer);
      //filter
      displace = new PIXI.filters.DisplacementFilter(displacementSprite);
      displace.blendMode = PIXI.BLEND_MODES.MULTIPLY;
      displace.scale.x = 0;
      displace.scale.y = 0;
      filters.push(displace);
      //container
      container = new PIXI.Container();
      container.filters = [displace];
      container.addChild(layer);
      container.alpha = 0;
      app.stage.addChild(container);
      //ANIMATE IN CONTAINER
      TweenLite.to(container, .4, {alpha: 1});
      containers.push(container);
      loadCount++;
      if(loadCount < layers.length){
        //load if any left
        appLoadLayers();
      }else{
        //all loaded
        appWarpLayers();
      }
    });
  }

  function appResizeLayer(sprite){
    w = pixiViewport.innerWidth();
    h = pixiViewport.innerHeight();
    r = sprite.texture.height / sprite.texture.width;
    pr = h / w;
    if(r<pr){
      sprite.height = h;
      sprite.width = (h / r);
    }else{
      sprite.height = (w * r);
      sprite.width = w;
    }
    sprite.x = w / 2;
    sprite.y = h / 2;
  }

  function appResizeRenderer(){
    if($('#intro').length){
      app.renderer.resize(pixiViewport.innerWidth(), pixiViewport.innerHeight());
    }
  }

  function appResizeLayers(){
    if(loadCount === layers.length){
      for(i=0;i<sprites.length;i++){
        appResizeLayer(sprites[i]);
      }
    }
  }

  function randomScale(){
    return (Math.random() * 10) + 3;
  }

  function appWarpLayers(){
    if(filters.length){
      st = $(window).scrollTop();
      TweenLite.to(filters[0].scale, 2, {x: st/s1, y: st/s1 });
      TweenLite.to(filters[1].scale, 1, {x: st/s2, y: st/s2 });
      TweenLite.to(filters[2].scale, .4, {x: st/s3, y: st/s3 });
      TweenLite.to(filters[3].scale, 2.4, {x: st/s4, y: st/s4 });
    }
  }

  $(window).on('scroll', appWarpLayers);
  $(window).on('resize', function(){
    appResizeRenderer();
    appResizeLayers();
  });


});
