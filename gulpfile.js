/**
 * Created by yumx on 2016/10/25.
 */
var gulp = require('gulp'),                 
    imagemin = require('gulp-imagemin'),       
    minifycss = require('gulp-minify-css'),   
    uglify = require('gulp-uglify'),          
    concat = require('gulp-concat'),         
    runSequence = require('run-sequence'),
    clean = require('gulp-clean'),
    path = require('path'),
    htmlminify = require("gulp-html-minify"),
    zip = require('gulp-zip'),
    color = require('gulp-color'),
    fs = require('fs'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    filter = require('gulp-filter'),
    nunjucksRender = require('gulp-nunjucks-api'),
    del = require('del');

// const isUn = gulp.env.un; //统一用户中心
const isUn = false; //统一用户中心
const genv = process.env.NODE_ENV.trim();
const config = (isUn == true) ? require('./unConfig/'+genv+'.js') : require('./defaultConfig/index.js');


gulp.task('copy', function () {
    var dist = 'public', src = 'static/**/*';
    var libsPath = './public/app/config/config.js';
   

    return gulp.src(src)
        .pipe(gulp.dest(dist))
        .on('end', function (e) {
            _main_();
        });

    function _main_ () {
        var env = process.env.NODE_ENV.trim();
        var fl = fs.readFileSync(libsPath, 'utf-8');
        var newfl = '';
        if(env == 'test') {
            newfl = fl.replace(/sever: 'dev'|sever: 'deploy'/g , 'sever: \'test\'');
            fs.writeFile('./public/app/config/config.js', newfl);
            console.log(color('当前执行环境是：'+ env, 'GREEN'))
        } else if(env == 'production') {
            newfl = fl.replace(/sever: 'dev'|sever: 'test'/g, 'sever: \'deploy\'');
            fs.writeFile('./public/app/config/config.js', newfl);
            console.log(color('当前执行环境是：'+ env, 'GREEN'))
        } else if(env == 'development') {
            newfl = fl.replace(/sever: 'deploy'|sever: 'test'/g, 'sever: \'dev\'');
            fs.writeFile('./public/app/config/config.js', newfl, function (err) {
                if(err) console.log(err)
            });
            console.log(color('当前执行环境是：'+ env, 'GREEN'))
        } else if(env == 'release') {
            newfl = fl.replace(/sever: 'dev'|sever: 'test'/g, 'sever: \'deploy\'');
            fs.writeFile('./public/app/config/config.js', newfl);
            console.log(color('当前执行环境是：'+ env, 'GREEN'))
        }
        
    };
});
//
gulp.task('ssoa', function () {
    return gulp.src('./public/app/config/*.js')
        .pipe(nunjucksRender({
            src: './public/app/config',
            data: config,
            extension:'.js'
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('./public/app/config'));
})

gulp.task('ssob', function () {
    return gulp.src(['public/pages/**/*.html'])
        .pipe(nunjucksRender({
            src: './public/pages',
            data: config,
            autoescape: false
        }))
        // .pipe(htmlminify())
        .pipe(gulp.dest('./public/pages'));
})
gulp.task('ssoc', function () {
    return gulp.src(['public/pages/**/*.js'])
        .pipe(nunjucksRender({
            src: './public/pages',
            data: config,
            extension:'.js',
            autoescape: false
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('./public/pages'));
})    


gulp.task('ssod', function () {
    return gulp.src(['public/app/js/header.js','public/app/js/navFooterLink.js'])
        .pipe(nunjucksRender({
            src: './public/app/js',
            data: config,
            extension:'.js',
            autoescape: false
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('./public/app/js'));
})   

gulp.task('ssoe', function () {
    return gulp.src(['public/app/components/**/*.js'])
        .pipe(nunjucksRender({
            src: './public/app/components',
            data: config,
            extension:'.js',
            autoescape: false
            
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('./public/app/components'));
})   



gulp.task('ssof', function () {
    return gulp.src('public/app/plugins/**/*.html')
    .pipe(nunjucksRender({
        src: 'public/app/plugins',
        data: config
    }))
    // .pipe(htmlminify())
    .pipe(gulp.dest('public/app/plugins'));
})   





gulp.task('del',function () {
    return del(['./public/app', './public/pages','./JSON', './JSON2', './views']);
});

gulp.task('revKoajs', function () {
    var jsSrc = ['./public/app/components/**/*'];
    
    return gulp.src(jsSrc)
        .pipe(rev())
        .pipe(gulp.dest('./public/app/components'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./JSON'))
});
gulp.task('copyKoa', function () {
    return gulp.src(['./viewsDev/**/*'])
        .pipe( gulp.dest('./views/') );
});

gulp.task('revKoa', function () {
    return gulp.src(['JSON/*.json', './viewsDev/components/**/*.html'])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {}
        }) )
        .pipe( gulp.dest('./views/components/') );
        
});

gulp.task('untpl', function() {
    return gulp.src(['views/_footer.html', 'views/loginbar.html'])
        .pipe(nunjucksRender({
            src: './views',
            data: config,
        }))
        // .pipe(htmlminify())
        .pipe(gulp.dest('./views'));
})

gulp.task('revPage', function () {
    var jsSrc = ['./public/pages/**/*.js','./public/pages/**/*.css'];
    
    return gulp.src(jsSrc)
        .pipe(rev())
        .pipe(gulp.dest('./public/pages/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./JSON2'))
});

gulp.task('changeJSON', function () {
    var fl = JSON.parse(fs.readFileSync('JSON2/rev-manifest.json', 'utf-8'))
    var ff = fl[path.diranme + '/' +path.basename + path.extname];
    var keys = Object.keys(fl);
    var values = [];
    for(var i in fl) {
        values.push(fl[i])
    }

    var newkeys= [];
    var newObject = {};
    keys.forEach(function (i, index ,arr) {
        var index = i.indexOf('/')+1;
        i = i.slice(index);
        newkeys.push(i)
    })

    newkeys.forEach(function (i, index, arr) {
        newObject[i] = values[index]
    })
    fs.writeFile('JSON2/rev-manifest.json', JSON.stringify(newObject,  null, 4), function(err){
        if(err) throw err;
        console.log('重新写入JOSN');
    });

});

gulp.task('revhtml', function () {
    return gulp.src(['JSON2/*.json', './public/pages/**/*.html'])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
               '': '../'
            }
        }) )
        .pipe( gulp.dest('./public/pages/') );
});

gulp.task('scripts', function() {
  return gulp.src(['./public/app/js/binder.js','./public/app/js/control.js','./public/app/js/core.js','./public/app/js/filter.js','./public/app/js/service.js','./public/app/js/store.js','./public/app/js/util.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./public/app/js'));
});


//压缩CSS & JS
gulp.task('JSCSS', function () {
    var jsSrc = ['./public/app/js/**.js','!./public/app/js/jquery.validate.min.js', '!./public/app/js/vendor.js', '!./public/app/js/placeholder.js', '!./public/app/js/ajaxfileupload.js'],
        jsDst = './public/app/js';
    gulp.src(jsSrc)
        .pipe(uglify())
        .pipe(gulp.dest(jsDst));
        
    gulp.src('./public/app/components/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/app/components/')); 
        
    gulp.src('./public/app/config/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/app/config/'));

    gulp.src('./public/app/components/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./public/app/components/')); 
    
    gulp.src('./public/app/css/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./public/app/css/'));    

    gulp.src('./public/app/plugins/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/app/plugins/')); 
    gulp.src('./public/app/plugins/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./public/app/plugins/'));          
    gulp.src('./public/app/plugins/**/*.html')
        .pipe(htmlminify())
        .pipe(gulp.dest('./public/app/plugins/'));          
});

gulp.task('run' , ['del'], function (done) {
    condition = false;
    runSequence(
        ['copy'],
        ['ssoa'],
        ['ssob'],
        ['ssoc'],
        ['ssod'],
        ['ssoe'],
        ['ssof'],
        ['revKoajs'],
        ['copyKoa'],
        ['untpl'],
        ['revKoa'],
        ['revPage'],
        ['changeJSON'],
        ['revhtml'],
        ['JSCSS'],
        // ['scripts'],
        done
    )
});


gulp.task('wt' , function (done) {
    condition = false;
    runSequence(
        ['copy'],
        ['ssoa'],
        ['ssob'],
        ['ssoc'],
        ['ssod'],
        ['ssoe'],
        ['ssof'],
        ['revKoajs'],
        ['copyKoa'],
        ['untpl'],
        ['revKoa'],
        ['revPage'],
        ['changeJSON'],
        ['revhtml'],
        ['JSCSS'],
        // ['scripts'],
        done
    )
});

gulp.task('watch', function () {
    gulp.watch('static/**/*', ['run'])
})
