document.body.onload = () => {
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if(!preloader.classList.contains('done')) {
            preloader.classList.add('done');
        }
    }, 1000);
}