import React, { Component } from 'react'
import SearchIcon from '@material-ui/icons/Search';
import onClickOutside from 'react-onclickoutside'

class _BoardFilter extends Component {

    state = {
        isOpen: false
    }

    handleClickOutside = () => {
        this.setState({ isOpen: false })
    }

    toggleSearch = (boolean = true) => {
        this.setState({ isOpen: boolean })
    }

    render() {
        const {isOpen} = this.state
        return (
            <div className={`board-filter flex align-center ${isOpen && 'open'}`}>
                <input type="text" name="txt" className="filter-by-txt" disabled={!isOpen} autoComplete="off"/>
                <SearchIcon onClick={this.toggleSearch} className="filter-icon" />
            </div>
        )
    }
}

export const BoardFilter = onClickOutside(_BoardFilter)