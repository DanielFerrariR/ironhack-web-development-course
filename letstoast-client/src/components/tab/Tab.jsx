import React from 'react';
import './Tab.scss';
import { Link } from 'react-router-dom';

const Tab = (props) => {

  const createList = () => {
    return props.to.map((each, i) => {
      if(props.current === each[1]) {
        return <li className = 'is-active' key={i}><Link to={each[0]}>{each[1]}</Link></li>
      } else {
        return <li key={i}><Link to={each[0]}>{each[1]}</Link></li>
      }
    })
  };

  return(
    props.user &&
    <div className="tabs is-centered tab-global">
      <ul>
        {createList()}
      </ul>
    </div>
  )
}

export default Tab;