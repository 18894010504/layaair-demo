class ShaderSimple{
    constructor(){
        this.rotation = new Laya.Vector3(0, 0.01, 0);
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.initShader();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        let camera = (this.scene.addChild(new Laya.Camera(0, 0.1, 100)));
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1.5));
        camera.addComponent(CameraMoveScript);
        Laya.Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, this.loadMeshSprite3D));
    }

    loadMeshSprite3D(mesh){
        let layaMonkey = this.scene.addChild(new Laya.MeshSprite3D(mesh));
        layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
        layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
        let customMaterial = new CustomMaterial();
        layaMonkey.meshRenderer.sharedMaterial = customMaterial;
        Laya.timer.frameLoop(1, this, function () {
            layaMonkey.transform.rotate(this.rotation, false);
        });
    }

    initShader(){
        let attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0
        };
        let uniformMap = {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE
        };
        let vs = "attribute vec4 a_Position;\n" +
            "uniform mat4 u_MvpMatrix;\n" +
            "uniform mat4 u_WorldMat;\n" +
            "attribute vec3 a_Normal;\n" +
            "varying vec3 v_Normal;\n" +
            "void main()\n" +
            "{\n" +
            "gl_Position = u_MvpMatrix * a_Position;\n" +
            "mat3 worldMat=mat3(u_WorldMat);\n" +
            "v_Normal=worldMat*a_Normal;\n" +
            "}";
        let ps = "#ifdef FSHIGHPRECISION\n" +
            "precision highp float;\n" +
            "#else\n" +
            "precision mediump float;\n" +
            "#endif\n" +
            "varying vec3 v_Normal;\n" +
            "void main()\n" +
            "{\n" +
            "gl_FragColor=vec4(v_Normal,1.0);\n" +
            "}";
        let customShader = Laya.Shader3D.add("CustomShader");
		let subShader =new Laya.SubShader(attributeMap, uniformMap);
        customShader.addSubShader(subShader);
		subShader.addShaderPass(vs, ps);
    }
}

//激活启动类
new ShaderSimple();
