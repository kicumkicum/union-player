import React from 'react';
import './player.sass';

const Player = () => {
  return (
    <>

      <div className="card">
        <div className="apple-stuff"><i className="fa fa-wifi">
          <div className="date">12:00 AM</div>
        </i><i className="fa fa-battery-3 battery"></i></div>
        <div className="picture-section">
          <h3>Now Playing</h3>
          <div className="band">
            <div className="overlay"></div>
          </div>
        </div>
        <div className="slider"></div>
        <div className="time"></div>
        <div className="song-title">
          <div className="artist">Phish</div>
          <div className="song">Suzy Greenberg</div>
        </div>
        <div className="playlist-controls">
          <div className="circle"></div>
          <div className="play-song"><i className="fa fa-play" id="play"></i></div>
        </div>
        <div className="song-list">
          <div className="line"></div>
          <div className="line two"></div>
          <div className="line three"></div>
          <div className="line four"></div>
          <table>
            <tr id="billy" data-title="billyBreathes">
              <td className="num">1</td>
              <td className="title">Billy Breathes</td>
              <td className="length">3:00</td>
            </tr>
            <tr id="hood" data-title="harryHood">
              <td className="num">2</td>
              <td className="title">Harry Hood</td>
              <td className="length">2:54</td>
            </tr>
            <tr id="suzy" data-title="suzyGreenberg">
              <td className="num">3</td>
              <td className="title">Suzy Greenberg</td>
              <td className="length">2:54</td>
            </tr>
            <tr id="divided" data-title="themeFromTheBottom">
              <td className="num">4</td>
              <td className="title">Theme From The Bottom</td>
              <td className="length">2:54</td>
            </tr>
          </table>
          <div className="social"><a href="https://twitter.com/McGreenBeats" target="_blank"><i
            className="fa fa-twitter"></i></a><a href="https://www.linkedin.com/in/mattcgreenberg" target="_blank"><i
            className="fa fa-linkedin"></i></a><a href="https://codepen.io/mattgreenberg/" target="_blank"><i
            className="fa fa-codepen"> </i></a></div>
        </div>
        <div className="volume"><i className="fa fa-volume-off" id="volume-off"></i><i className="fa fa-volume-up"
                                                                                       id="volume-up"></i>
          <div className="slider-volume"></div>
        </div>
        <div className="slide-up"><i className="fa fa-chevron-up"></i></div>
      </div>
    </>
  );
}

export {
  Player,
};
