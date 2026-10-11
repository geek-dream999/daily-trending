/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-19 17:52:08
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-10-09 09:06:01
 * @Description: 顶部布局
 */
'use client'
import { House, LogoGithub } from '@gravity-ui/icons'
import { Description } from '@heroui/react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import HotSearch from '@/components/HotSearch'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import TimeAndLunar from '@/components/TimeAndLunar'
import { appPath } from '@/lib/app-path'

// Vercel 最佳实践：HotSettings 含 @dnd-kit 等重依赖，动态导入避免进入首屏 bundle
const HotSettings = dynamic(() => import('@/components/HotSettings'))

export default function Header() {
  return (
    <div className="shrink-0 sticky top-0 z-20 backdrop-blur-sm p-4 container mx-auto grid grid-cols-2 sm:grid-cols-3 items-center">
      <div className="flex gap-2 items-center justify-self-start">
        <div className="size-9 relative">
          <Image fill alt="Logo" src={appPath('/logo.svg')} />
        </div>
        <div>
          <h1 className="font-black text-base">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
          <Description className="mt-0.5 hidden sm:block">{process.env.NEXT_PUBLIC_APP_DESC}</Description>
        </div>
      </div>
      <TimeAndLunar />
      <div className="flex gap-1 justify-self-end">
        {/* 全局搜索（Ctrl/⌘+K，触发按钮与 Modal 一体在 HotSearch 内部） */}
        <HotSearch />

        {/* 热榜设置（Tooltip 内置于 HotSettings，只包裹触发按钮；若在此包住整个 Modal，
            弹窗经 portal 渲染后仍在 Tooltip 触发元素之下，弹窗内 hover 会误触发 Tooltip） */}
        <HotSettings />

        {/* 主题切换按钮 */}
        <ThemeSwitcher />

        <a
          aria-label="个人 GitHub 仓库"
          className="flex size-8 items-center justify-center rounded-lg hover:bg-default-100"
          href="https://github.com/geek-dream999/daily-trending"
          rel="noopener noreferrer"
          target="_blank"
          title="GitHub 仓库"
        >
          <LogoGithub width={16} />
        </a>
        <a
          aria-label="个人博客"
          className="flex size-8 items-center justify-center rounded-lg hover:bg-default-100"
          href="https://yahuihui.cn"
          rel="noopener noreferrer"
          target="_blank"
          title="个人博客"
        >
          <House width={16} />
        </a>
      </div>
    </div>
  )
}
