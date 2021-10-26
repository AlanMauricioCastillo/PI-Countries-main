/* import "./Paginado.css";
import {useDispatch} from "react-redux"
import { useEffect } from "react"
import {getThemAll} from "../../actions/getThemAll"
import { NavLink } from 'react-router-dom';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
/* 
export default function Paginado() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getThemAll())
  }, [dispatch])
  return (
    <div>
    <span>paginado</span>
    <NavLink exact to="/pokemon" >
      <button className="get" type="submit">Get them all</button>
      </NavLink>
    </div>
  );
} 


class Pagination extends Component {
  constructor(props) {
    super(props);
    const { totalRecords = null, pageLimit = 30, pageNeighbours = 0 } = props;

    this.pageLimit = typeof pageLimit === 'number' ? pageLimit : 30;
    this.totalRecords = typeof totalRecords === 'number' ? totalRecords : 0;

    // pageNeighbours can be: 0, 1 or 2
    this.pageNeighbours = typeof pageNeighbours === 'number'
      ? Math.max(0, Math.min(pageNeighbours, 2))
      : 0;

    this.totalPages = Math.ceil(this.totalRecords / this.pageLimit);

    this.state = { currentPage: 1 };
  }
}

Pagination.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  pageLimit: PropTypes.number,
  pageNeighbours: PropTypes.number,
  onPageChanged: PropTypes.func
};

export default Pagination; */