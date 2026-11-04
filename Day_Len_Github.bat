@echo off
chcp 65001 >nul
title DAY CODE LEN GITHUB CHO VERCEL DEPLOY - VKU
echo ===================================================================
echo    DANG DONG BO CODE LEN GITHUB: ngoduongkiet/vku-phishing-dw
echo ===================================================================
echo.

cd /d "D:\kho dữ liệu (5)\Phishing_DW_Project\web-dashboard"

git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/ngoduongkiet/vku-phishing-dw.git
git push -u origin main

echo.
echo ===================================================================
if %ERRORLEVEL% equ 0 (
    echo  DA DAY CODE LEN GITHUB THANH CONG 100%!
    echo  Bay gio ban chi can vao Vercel bam '+ Tao moi' -^> 'Du an' la thay ngay!
) else (
    echo  LUU Y: Neu chua tao repo tren GitHub, hay vao https://github.com/new
    echo  de tao repo ten la 'vku-phishing-dw' truoc, sau do chay lai file nay!
)
echo ===================================================================
pause
