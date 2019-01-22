import React from 'react'
import Head from '_src/components/Head/Head'
import logo from '_src/assets/images/logo_tiger.png'
import './AboutUs.less'
const AboutUs = () => {
  return (
    <div className="about-us-page">
      <Head back={true} title="关于我们" />
      <div className="about-us">
        <div className="logo">
          {' '}
          <img src={logo} alt="logo"/>
          一只虎度假直通车 1.0.0
        </div>

        <p>
          <b>搜索 发现 享优惠</b>
        </p>

        <p>
          [一只虎度假直通车]
          公众号是由多位旅游达人创办，为您网罗全世界酒店和旅游的优惠情报,并提供个性化优惠推送。
        </p>

        <p>优惠房价 · 特惠套餐 · 免费餐饮 · 订房送门票 · 预订更靠谱</p>

        <p>淘优惠就到[一只虎度假直通车]!</p>

        <p>客服邮箱：service@haiyaozhu.com</p>
      </div>
    </div>
  )
}

export default AboutUs
