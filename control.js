 // Render song
            // Scroll top
            // Play/pause/seek
            // CD rotate
            // Next/prev
            // Random
            // Next/ Repeat when ended
            // Active song
            // Scroll Active Song into view
            // Play song when click

            const $ = document.querySelector.bind(document)
            const $$ = document.querySelectorAll.bind(document)

            const PlAYER_STORAGE_KEY = 'KHANHLY_PLAYER'

            const playlist = $(`.playlist`);
            const heading = $('header h2')
            const cdTumb = $('.cd-thumb')
            const audio = $('#audio')
            const playBtn = $('.btn-toggle-play')
            const cd = $('.cd')
            const playes = $('.player')
            const progess = $('#progress')
            const prevBtn = $('.btn-prev')
            const nextBtn = $('.btn-next')
            const ranDom = $('.btn-random')
            const repeatBtn = $('.btn-repeat')
            
        const app ={
            currentIndex:0,
            isPlaying: false,
            isranDom: false,
            isRepeat:false,
            config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
            
            songs:[
                {
                    
                    name: 'As If ItS Your Last',
                    singer: 'BLACKPINK', 
                    path: './music/AsIfItSYourLast.mp3',
                    image: './music/img/img1.jpg'
                },
                {
                    name: 'Attention',
                    singer: 'New Jean', 
                    path: './music/Attention.mp3',
                    image: './music/img/img2.jpg'
                },
                {
                    name: 'Boombayah',
                    singer: 'BLACKPINK', 
                    path: './music/Boombayah-BLACKPINK-6291993.mp3',
                    image: './music/img/img3.jpg'
                },
                {
                    name: 'Hype Boy',
                    singer: 'New Jean', 
                    path: './music/HypeBoy.mp3',
                    image: './music/img/img4.jpg'
                },
                {
                    name: 'Shut Down',
                    singer: 'BLACKPINK', 
                    path: './music/ShutDown-BLACKPINK-7887142.mp3',
                    image: './music/img/img5.jpg'
                },
            ],

            setConfig:function(key, value){
                this.config[key] = value;
                localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config))
            },
            render: function(){
                const html = this.songs.map((song,index) =>{
                    return `
                        <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;

                })
                playlist.innerHTML = html.join('\n');
            },

            handleEvent: function(){
                const cdWidth = cd.offsetWidth
                const _this = this
                
                // Xu ly CD quay
                const CDThumbanimate = cdTumb.animate([
                    {transform: 'rotate(360deg)'}
                ],
                {
                    duration: 10000,
                    iterations: Infinity
                }
                )

                CDThumbanimate.pause()

                document.onscroll = function(){
                    const scrollTop =  window.scrollY || document.documentElement.scrollTop;
                    const newCdWidth = cdWidth - scrollTop;
                    cd.style.width = newCdWidth >0 ? newCdWidth+'px': 0;
                    cd.style.opacity = newCdWidth/ cdWidth
                }

                //xu ly ki click play
                playBtn.onclick= function(){
                    if(_this.isPlaying){
                        audio.pause();
                    }else{
                        audio.play()
                    } 
                }

                //KHI BAI HAT DUOC PLAY
                audio.onplay = function(){
                    _this.isPlaying = true
                    playes.classList.add('playing')
                    CDThumbanimate .play()
                }
                // Khi baif hat bi dung
                audio.onpause = function(){
                    _this.isPlaying = false;
                    CDThumbanimate .pause()
                    playes.classList.remove('playing')
                }
                //Khi tien do bai hat thay doi
                audio.ontimeupdate = function(){
                    if (audio.duration){
                       const proPersent = Math.floor(audio.currentTime / audio.duration*100)
                        progess.value = proPersent
                    }
                    
                }
                //Xu ly khi tua bai hat
                progess.onchange = function(e){
                    const seekTime = audio.duration  / 100*e.target.value
                    audio.currentTime = seekTime
                }

                //Khi chuyen tiep bai hat
                nextBtn.onclick = function(){
                    if(_this.isranDom){
                        _this.playranDomSong()
                    }else{
                        _this.nextSong()
                    }
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()
                }
                prevBtn.onclick = function(){
                    if(_this.isranDom){
                        _this.playranDomSong()
                    }else{
                        _this.prevSong()
                    }
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()
                }

                //XU LY BAT/ TAT RANDOM SONG
                ranDom.onclick = function(e){
                    //gan gia tri cua nut dos se bang tang thai nguoc lai hien tai
                    _this.isranDom = !_this.isranDom
                    _this.setConfig('isranDom', _this.isranDom)
                    //dung toggle neu boolean la true ti sex add, neu laf false se emove class
                    ranDom.classList.toggle('active', _this.isranDom)
                   
                }

                //xu ly next sau ki audio ended
                audio.onended = function(){
                    if(_this.isRepeat){
                        audio.play()
                    }else{
                        nextBtn.click()
                    }
                }

                // xu ly lap lai Song
                repeatBtn.onclick = function(){
                    _this.isRepeat = !_this.isRepeat
                    _this.setConfig('isRepeat',  _this.isRepeat)
                    repeatBtn.classList.toggle('active', _this.isRepeat)
                }
                //lang nge hnh vi click vào playlist
                playlist.onclick = function(e){
                    const songNode = e.target.closest('.song:not(.active)')
                    //xu ly khi click vao song cuyen den bai do
                    if(songNode || e.target.closest('.option')
                    ){ 
                        if(songNode){
                            _this.currentIndex = Number(songNode.dataset.index)
                            _this.loadCurrentSong()
                            _this.render()
                            audio.play()
                           
                        }
                        //xu ly khi click option
                        if(e.target.closest('.option')){

                        }
                    }
                }

            },
           
            definePropeties: function(){
                Object.defineProperty(this, 'currentSong', {
                    get:function(){
                        return this.songs[this.currentIndex];
                    }
                })
            },
            scrollToActiveSong :function(){
                setTimeout(() =>{
                    $('.song.active').scrollIntoView({
                        behavior:'smooth',
                        block: 'end',
                    })
                }, 300)
            },
           loadCurrentSong: function(){

                heading.textContent = this.currentSong.name
                cdTumb.style.backgroundImage = `url('${this.currentSong.image}')`
                audio.src = this.currentSong.path

                console.log(heading,cdTumb,audio)
           },
           loadConfig: function(){
            this.isranDom = this.config.isranDom
            this.isRepeat = this.config.isRepeat
            // Object.assign(this, this.config)
           },

           nextSong: function(){
                this.currentIndex++
                if(this.currentIndex >= this.songs.length){
                    this.currentIndex = 0
                }
                this.loadCurrentSong()
           },
           prevSong: function(){
            this.currentIndex--
            if(this.currentIndex < 0){
                this.currentIndex = this.songs.length -1
            }
            this.loadCurrentSong()
            },
            playranDomSong: function(){
                let newIndex
               do{
                newIndex = Math.floor(Math.random() * this.songs.length)
               }   while(newIndex === this.currentIndex)  
                this.currentIndex = newIndex
                this.loadCurrentSong()
            },
            start: function(){
                //Gán cấu hình từ Config vào Ứng dụng
                this.loadConfig()
                // định nghĩa các thuộc tín cho phương thức
                this.definePropeties();

                //Lứng nge/ xư lý các sự kiện
                this.handleEvent();

                //Tai thong tin bai hat dau tien vao Ui khi chay ung dung
                this.loadCurrentSong();

                //ender playlist
                this.render();

                //Hiển thị trạng thái ban đầu của button repeat và random
                repeatBtn.classList.toggle('active', this.isRepeat)
                ranDom.classList.toggle('active', this.isranDom)
            }

        }
        app.start();