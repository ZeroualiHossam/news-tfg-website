import React, { useState, useEffect } from 'react';
import './MainPage.css';
import newsData from '../assets/news_groups.json';
import { Link } from 'react-router-dom';

const layoutMap = [
  { col: '1', row: '1' },
  { col: '2', row: '1' },
  { col: '3', row: '1' },
  { col: '1', row: '2' },
  { col: '2 / span 2', row: '2' }
];

const MainPage = () => {
  const [news, setNews] = useState([]);
  useEffect(() => setNews(newsData), []);

  const getImageByGroupId = id => {
    const idx = Math.floor(Math.random() * 3) + 1;
    return `/assets/images/group_${id}_image_${idx}.jpg`;
  };

  return (
    <>
      <h1 className="grid-title">Latest News</h1>

      {/* GRID PRINCIPAL FIJO */}
      <div className="grid-container">
        {news.slice(0, 5).map((item, i) => (
          <Link
            key={item.group_id}
            to={`/grupo/${item.group_id}`}
            className="grid-item"
            style={{
              gridColumn: layoutMap[i].col,
              gridRow:    layoutMap[i].row,
              backgroundImage: `url(${getImageByGroupId(item.group_id)})`
            }}
          >
            <div className="overlay">
              <h2>{item.title}</h2>
              <p>{item.long_summary.slice(0, 80)}…</p>
            </div>
          </Link>
        ))}
      </div>

      {/* SLIDER HORIZONTAL CON MÁS NOTICIAS */}
      <h2 className="slider-title">More News</h2>
      <div className="slider-container">
        <div className="more-news-row">
          {news.slice(5).map(item => (
            <Link
              key={item.group_id}
              to={`/grupo/${item.group_id}`}
              className="more-news-item"
            >
              <img src={getImageByGroupId(item.group_id)} alt="" />
              <h4>{item.title}</h4>
              <p className="lead">{item.lead}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainPage;