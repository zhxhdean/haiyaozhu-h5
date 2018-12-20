import React, { Component } from 'react'
import Slider from 'react-slick'
import Head from '../../components/Head/Head'
import { inject, observer } from 'mobx-react'
import DefaultImage from '../../common/img'
import '../HotelDetail/HotelDetail.less'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
// 图片预览

@inject('hotelDetailStore')
@observer
class HotelPictureDetail extends Component {

  componentDidMount () {
    const index = +this.props.match.params.id
    this.slider && this.slider.slickGoTo(index)
  }

  render() {
    const { hotelDetail } = this.props.hotelDetailStore
    const settings = {
      autoplay: false,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    }
    return (
      <div style={{ background: '#000', height: '667px' }}>
        <Head back={true} title="图片预览" />

        <Slider {...settings} ref={slider => (this.slider = slider)}>
          {hotelDetail.hotelImageList.map((item, index) => {
            return (
              <div key={index}>
                <div
                  className="picture-brower"
                  style={{
                    backgroundImage: `url(${item.ImageUrl || DefaultImage})`
                  }}
                />
              </div>
            )
          })}
        </Slider>
      </div>
    )
  }
}

export default HotelPictureDetail
