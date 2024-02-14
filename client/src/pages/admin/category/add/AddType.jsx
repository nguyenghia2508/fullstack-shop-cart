import { Link, useNavigate } from "react-router-dom"
import { useState,useEffect } from "react"
import { Controller, useForm } from "react-hook-form";
import AdminLayout from "../../../../components/layout/admin/AdminLayout";
import adminApi from "../../../../api/admin/adminApi";
import Loading from "../../../../components/common/Loading";
import { yupResolver } from "@hookform/resolvers/yup";
import {schema} from './data';
import './add-resize-style.css'
import './add-style.scss'
import { toast } from "react-toastify";

const AddType = () => {

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
        setValue,
        clearErrors,
        watch,
        register,
        submit
    } = useForm({
        mode: 'all',
        resolver: yupResolver(schema()),
    });
    
    const navigate = useNavigate()

    const [title, setTitle] = useState(null)
    const [currPage, setCurrPage] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getAddTitleProduct= async () => {
            try {
                const data = await adminApi.getTypeTitle()
                setTitle(data.title)
                setCurrPage(data.currPage)
            } catch (err) {
                console.log(err)
            }
        }
        getAddTitleProduct();
    }, []);

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const res = await adminApi.addType(data)
            if (res.state === 'success') {
                setLoading(false)
                navigate('/admin/list-type')
                toast.success(res.message, {
                    position: 'top-left',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#fff' },
                });
            }
        } catch (err) {
            setLoading(false)
            const errors = err.data.msg
            toast.error(errors, {
                position: 'top-left',
                autoClose: 3000,
                style: { color: '$color-default', backgroundColor: '#fff' },
            });
        }
    }

    return (
        <AdminLayout 
        title={title}
        currPage={currPage}
        add={
            loading ? <Loading/> :
            <div className="addPage">
                <div className="formbold-main-wrapper">
                    <div className="formbold-form-wrapper">
                        <svg className="formbold-img" width="448" height="280" viewBox="0 0 448 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M212.928 111.419C213.11 89.2347 214.014 66.8355 215.641 44.222C215.668 43.7731 215.701 43.3309 215.735 42.882C216.595 31.1095 217.647 19.2947 218.891 7.43735V7.37034C218.89 5.41596 218.111 3.54197 216.726 2.16001C215.341 0.778061 213.463 0.00116625 211.505 0H13.4214C11.4694 0.00382696 9.598 0.776979 8.21462 2.15112C6.83124 3.52526 6.04792 5.38911 6.0352 7.33683C4.31623 23.6655 2.96881 39.9137 1.99294 56.0816C1.95265 56.6109 1.9258 57.1335 1.89894 57.6628C1.41548 65.6563 1.03051 73.6297 0.744014 81.5829C0.72387 82.052 0.703721 82.521 0.697006 82.99C-1.13623 131.788 0.648037 180.655 6.0352 229.191C6.04931 231.137 6.8333 233 8.21657 234.372C9.59984 235.745 11.4705 236.517 13.4214 236.521H211.505C213.463 236.52 215.341 235.743 216.726 234.361C218.111 232.979 218.89 231.105 218.891 229.15V229.077C217.917 220.454 217.062 211.774 216.326 203.039C216.219 201.76 216.113 200.48 216.01 199.2C215.5 192.909 215.055 186.592 214.674 180.252C214.594 178.972 214.52 177.692 214.453 176.412C213.734 163.722 213.264 150.933 213.042 138.046C213.016 136.767 212.995 135.494 212.975 134.207C212.895 127.916 212.87 121.599 212.901 115.259C212.901 113.979 212.908 112.699 212.928 111.419Z" fill="#F0F0F0"/>
                        <path d="M272.609 50.2532C272.607 48.2988 271.829 46.4248 270.444 45.0428C269.059 43.6609 267.181 42.884 265.222 42.8828H67.139C65.187 42.8866 63.3156 43.6598 61.9322 45.0339C60.5488 46.4081 59.7655 48.2719 59.7528 50.2196C53.065 113.852 51.957 176.36 56.4357 236.522C56.9796 243.966 57.6153 251.372 58.3427 258.74C58.7322 262.686 59.1462 266.622 59.5849 270.546C59.6386 271.055 59.6924 271.564 59.7528 272.074C59.7669 274.02 60.5509 275.883 61.9342 277.255C63.3174 278.628 65.1881 279.4 67.139 279.404H265.222C267.181 279.403 269.059 278.626 270.444 277.244C271.829 275.862 272.607 273.988 272.609 272.033V271.96C264.598 201.09 264.598 126.523 272.609 50.3202V50.2532Z" fill="white"/>
                        <path d="M272.609 50.2532C272.607 48.2988 271.829 46.4248 270.444 45.0428C269.059 43.6609 267.181 42.884 265.222 42.8828H67.139C65.187 42.8866 63.3156 43.6598 61.9322 45.0339C60.5488 46.4081 59.7655 48.2719 59.7528 50.2196C53.065 113.852 51.957 176.36 56.4357 236.522C56.9796 243.966 57.6153 251.372 58.3427 258.74C58.7322 262.686 59.1462 266.622 59.5849 270.546C59.6386 271.055 59.6924 271.564 59.7528 272.074C59.7669 274.02 60.5509 275.883 61.9342 277.255C63.3174 278.628 65.1881 279.4 67.139 279.404H265.222C267.181 279.403 269.059 278.626 270.444 277.244C271.829 275.862 272.607 273.988 272.609 272.033V271.96C264.598 201.09 264.598 126.523 272.609 50.3202V50.2532ZM271.266 272.074C271.254 273.665 270.612 275.188 269.48 276.31C268.348 277.432 266.818 278.062 265.222 278.064H67.139C65.5369 278.061 64.0012 277.425 62.8684 276.295C61.7356 275.164 61.0981 273.632 61.0957 272.033V271.96C61.0487 271.531 61.0017 271.095 60.9547 270.666C60.4914 266.566 60.0594 262.454 59.6588 258.331C58.9537 251.102 58.3293 243.832 57.7854 236.522C53.3067 176.393 54.4079 113.926 61.0957 50.3202V50.2532C61.0981 48.6546 61.7356 47.1221 62.8684 45.9918C64.0012 44.8614 65.5369 44.2253 67.139 44.2229H265.222C266.819 44.2234 268.351 44.8543 269.483 45.9778C270.615 47.1014 271.256 48.6263 271.266 50.2196C263.255 126.483 263.255 201.131 271.266 272.074Z" fill="#E4E4E4"/>
                        <path d="M80.7926 111.42C80.283 111.421 79.7948 111.624 79.435 111.984C79.0751 112.344 78.873 112.832 78.873 113.34C78.873 113.849 79.0751 114.337 79.435 114.697C79.7948 115.057 80.283 115.26 80.7926 115.261H241.765C242.274 115.26 242.763 115.057 243.122 114.697C243.482 114.337 243.684 113.849 243.684 113.34C243.684 112.832 243.482 112.344 243.122 111.984C242.763 111.624 242.274 111.421 241.765 111.42H80.7926Z" fill="#E6E6E6"/>
                        <path d="M80.7927 122.943C80.2828 122.944 79.7942 123.147 79.434 123.507C79.0739 123.867 78.8716 124.355 78.8716 124.864C78.8716 125.373 79.0739 125.861 79.434 126.221C79.7942 126.581 80.2828 126.783 80.7927 126.784H190.071C190.581 126.783 191.069 126.581 191.429 126.221C191.79 125.861 191.992 125.373 191.992 124.864C191.992 124.355 191.79 123.867 191.429 123.507C191.069 123.147 190.581 122.944 190.071 122.943H80.7927Z" fill="#E6E6E6"/>
                        <path d="M80.7927 134.207C80.2828 134.208 79.7942 134.411 79.434 134.771C79.0739 135.131 78.8716 135.619 78.8716 136.128C78.8716 136.636 79.0739 137.124 79.434 137.484C79.7942 137.844 80.2828 138.047 80.7927 138.048H241.765C242.275 138.047 242.763 137.844 243.123 137.484C243.484 137.124 243.686 136.636 243.686 136.128C243.686 135.619 243.484 135.131 243.123 134.771C242.763 134.411 242.275 134.208 241.765 134.207H80.7927Z" fill="#E6E6E6"/>
                        <path d="M80.7926 145.73C80.283 145.732 79.7948 145.935 79.435 146.295C79.0751 146.655 78.873 147.143 78.873 147.651C78.873 148.159 79.0751 148.647 79.435 149.007C79.7948 149.367 80.283 149.57 80.7926 149.572H190.071C190.58 149.57 191.068 149.367 191.428 149.007C191.788 148.647 191.99 148.159 191.99 147.651C191.99 147.143 191.788 146.655 191.428 146.295C191.068 145.935 190.58 145.732 190.071 145.73H80.7926Z" fill="#E6E6E6"/>
                        <path d="M80.7926 176.412C80.283 176.413 79.7948 176.616 79.435 176.976C79.0751 177.336 78.873 177.824 78.873 178.333C78.873 178.841 79.0751 179.329 79.435 179.689C79.7948 180.049 80.283 180.252 80.7926 180.253H241.765C242.274 180.252 242.763 180.049 243.122 179.689C243.482 179.329 243.684 178.841 243.684 178.333C243.684 177.824 243.482 177.336 243.122 176.976C242.763 176.616 242.274 176.413 241.765 176.412H80.7926Z" fill="#E6E6E6"/>
                        <path d="M80.7927 187.938C80.2828 187.938 79.7942 188.141 79.434 188.501C79.0739 188.861 78.8716 189.349 78.8716 189.858C78.8716 190.367 79.0739 190.855 79.434 191.215C79.7942 191.575 80.2828 191.778 80.7927 191.779H190.071C190.581 191.778 191.069 191.575 191.429 191.215C191.79 190.855 191.992 190.367 191.992 189.858C191.992 189.349 191.79 188.861 191.429 188.501C191.069 188.141 190.581 187.938 190.071 187.938H80.7927Z" fill="#E6E6E6"/>
                        <path d="M80.7927 199.199C80.2828 199.2 79.7942 199.403 79.434 199.763C79.0739 200.123 78.8716 200.611 78.8716 201.12C78.8716 201.628 79.0739 202.116 79.434 202.477C79.7942 202.837 80.2828 203.039 80.7927 203.04H241.765C242.275 203.039 242.763 202.837 243.123 202.477C243.484 202.116 243.686 201.628 243.686 201.12C243.686 200.611 243.484 200.123 243.123 199.763C242.763 199.403 242.275 199.2 241.765 199.199H80.7927Z" fill="#E6E6E6"/>
                        <path d="M80.7926 210.725C80.283 210.726 79.7948 210.929 79.435 211.289C79.0751 211.649 78.873 212.137 78.873 212.645C78.873 213.154 79.0751 213.641 79.435 214.001C79.7948 214.361 80.283 214.564 80.7926 214.566H190.071C190.58 214.564 191.068 214.361 191.428 214.001C191.788 213.641 191.99 213.154 191.99 212.645C191.99 212.137 191.788 211.649 191.428 211.289C191.068 210.929 190.58 210.726 190.071 210.725H80.7926Z" fill="#E6E6E6"/>
                        <path d="M112.643 87.5731H81.8977C81.4995 87.5727 81.1178 87.4146 80.8362 87.1337C80.5546 86.8527 80.3962 86.4717 80.3958 86.0744V81.1589C80.3962 80.7616 80.5546 80.3806 80.8362 80.0996C81.1178 79.8186 81.4995 79.6606 81.8977 79.6602H112.643C113.041 79.6606 113.423 79.8186 113.705 80.0996C113.986 80.3806 114.145 80.7616 114.145 81.1589V86.0744C114.145 86.4717 113.986 86.8527 113.705 87.1337C113.423 87.4146 113.041 87.5727 112.643 87.5731Z" fill="#6A64F1"/>
                        <path d="M219.452 245.684L210.035 248.79C208.465 249.307 206.895 249.825 205.326 250.342C203.872 250.82 202.299 251.388 200.743 251.183C199.668 251.041 198.442 250.423 198.106 249.319C197.789 248.274 198.462 247.181 199.276 246.563C201.523 244.857 204.365 246.594 205.957 248.36C207.905 250.521 209.007 253.311 210.834 255.573C212.46 257.601 214.522 259.239 216.867 260.367C221.527 262.563 227.212 262.33 231.37 259.13C236.334 255.309 236.84 248.686 236.866 242.908C236.857 242.648 236.747 242.401 236.559 242.22C236.371 242.039 236.12 241.938 235.859 241.938C235.598 241.938 235.347 242.039 235.159 242.22C234.971 242.401 234.861 242.648 234.852 242.908C234.828 248.145 234.53 254.564 229.745 257.84C225.161 260.979 219.137 260.147 214.918 256.802C212.566 254.939 211.12 252.509 209.576 249.992C208.069 247.536 206.197 245.155 203.361 244.2C202.145 243.758 200.813 243.75 199.591 244.176C198.37 244.601 197.333 245.435 196.656 246.536C196.347 247.055 196.152 247.634 196.084 248.234C196.017 248.835 196.079 249.443 196.265 250.017C196.451 250.592 196.758 251.121 197.165 251.568C197.573 252.015 198.071 252.37 198.626 252.61C201.915 254.174 205.677 252.341 208.844 251.297L219.988 247.622C221.213 247.218 220.688 245.277 219.452 245.684L219.452 245.684Z" fill="#6A64F1"/>
                        <path d="M66.454 0C65.3976 18.7388 58.4947 36.6787 46.7118 51.3078C34.929 65.9369 18.8562 76.5227 0.744029 81.5829C0.723885 82.052 0.703736 82.521 0.697021 82.99C19.1844 77.9151 35.6073 67.1739 47.6471 52.283C59.6868 37.3921 66.7352 19.1037 67.797 0H66.454Z" fill="white"/>
                        <path d="M45.8869 0C42.7664 11.8306 37.2657 22.9036 29.7195 32.545C22.1734 42.1864 12.7397 50.1945 1.99292 56.0816C1.95263 56.6109 1.92578 57.1335 1.89893 57.6628C13.0366 51.6907 22.8168 43.4856 30.6258 33.5626C38.4347 23.6396 44.1036 12.213 47.2768 0H45.8869Z" fill="white"/>
                        <path d="M410.163 199.605C409.954 199.839 409.746 200.08 409.545 200.322C406.731 203.58 404.189 207.062 401.944 210.734C401.762 211.015 401.588 211.303 401.427 211.585C396.112 220.456 392.494 230.234 390.757 240.423C390.368 242.728 390.074 245.046 389.877 247.378C389.736 249.173 389.651 250.971 389.622 252.772C389.515 260.329 390.186 268.738 385.305 274.514C384 276.034 382.407 277.282 380.618 278.186C379.27 278.882 377.846 279.419 376.374 279.787H361.152C360.386 279.673 359.621 279.553 358.856 279.432C358.835 279.432 358.815 279.425 358.795 279.425L358.641 279.479L357.721 279.787L357.68 279.801V279.787C357.682 279.76 357.679 279.733 357.674 279.707C357.675 279.658 357.673 279.608 357.667 279.559V279.553C357.66 279.419 357.654 279.291 357.654 279.157L357.633 278.802C357.633 278.802 357.627 278.796 357.633 278.796C357.627 278.595 357.613 278.394 357.607 278.186C356.902 260.698 358.621 242.627 366.893 227.23C369.73 221.954 373.383 217.158 377.717 213.019C377.742 212.992 377.769 212.968 377.798 212.945C386.399 204.757 397.519 199.404 409.256 199.585C409.558 199.585 409.86 199.591 410.163 199.605Z" fill="#F0F0F0"/>
                        <path d="M410.197 199.982C396.903 206.789 386.097 217.603 379.314 230.888C377.803 233.722 376.748 236.776 376.19 239.937C375.746 243.034 376.141 246.194 377.335 249.087C378.393 251.807 379.792 254.467 380.169 257.396C380.34 258.899 380.191 260.42 379.731 261.861C379.271 263.301 378.512 264.629 377.502 265.756C375.059 268.63 371.726 270.457 368.405 272.13C364.718 273.988 360.859 275.859 358.299 279.218C357.988 279.625 357.374 279.121 357.684 278.714C362.138 272.871 369.982 271.596 375.324 266.845C377.817 264.628 379.655 261.647 379.448 258.215C379.267 255.213 377.827 252.469 376.731 249.724C375.526 246.919 375.027 243.861 375.278 240.819C375.673 237.64 376.608 234.55 378.041 231.683C381.166 225.178 385.297 219.203 390.281 213.978C395.937 207.983 402.579 202.998 409.92 199.238C410.374 199.005 410.648 199.751 410.197 199.982H410.197Z" fill="white"/>
                        <path d="M381.246 226.482C379.167 225.044 377.668 222.915 377.016 220.475C376.365 218.036 376.604 215.445 377.69 213.165C377.912 212.705 378.639 213.026 378.418 213.487C377.402 215.609 377.18 218.022 377.791 220.292C378.402 222.563 379.807 224.54 381.751 225.868C382.173 226.157 381.666 226.769 381.246 226.482Z" fill="white"/>
                        <path d="M376.616 247.777C381.713 246.903 386.292 244.144 389.441 240.05C389.752 239.644 390.367 240.148 390.056 240.554C386.772 244.808 382 247.669 376.695 248.568C376.189 248.653 376.113 247.862 376.616 247.778V247.777Z" fill="white"/>
                        <path d="M396.355 208.951C397.043 209.674 397.901 210.216 398.851 210.527C399.801 210.839 400.814 210.91 401.798 210.734C402.302 210.642 402.377 211.433 401.876 211.524C400.788 211.713 399.669 211.633 398.619 211.292C397.569 210.95 396.618 210.357 395.851 209.564C395.772 209.496 395.722 209.4 395.712 209.296C395.702 209.192 395.732 209.088 395.795 209.006C395.862 208.925 395.959 208.874 396.064 208.863C396.169 208.853 396.273 208.884 396.355 208.951Z" fill="white"/>
                        <path d="M447.234 248.088C446.925 248.155 446.616 248.222 446.301 248.296H446.294C442.086 249.208 437.959 250.459 433.953 252.035C433.644 252.155 433.335 252.276 433.026 252.403H433.019C423.469 256.283 414.719 261.889 407.208 268.939C407.181 268.966 407.154 268.986 407.127 269.013C407.111 269.033 407.093 269.051 407.074 269.067L407.04 269.1C404.06 271.917 401.297 274.954 398.774 278.186C398.774 278.193 398.768 278.199 398.761 278.206C398.358 278.729 397.948 279.251 397.545 279.787H357.721L357.68 279.801V279.787H357.512C357.512 279.781 357.519 279.774 357.526 279.767C357.526 279.76 357.533 279.76 357.533 279.754C357.58 279.687 357.627 279.62 357.667 279.559V279.553C357.677 279.533 357.691 279.514 357.707 279.499C357.747 279.432 357.794 279.379 357.828 279.318C358.097 278.943 358.358 278.561 358.627 278.186C359.064 277.563 359.507 276.94 359.957 276.323C359.957 276.322 359.957 276.321 359.957 276.321C359.957 276.32 359.958 276.319 359.959 276.318C359.959 276.318 359.96 276.317 359.961 276.317C359.962 276.317 359.962 276.316 359.963 276.316V276.31C359.97 276.303 359.97 276.296 359.977 276.29L359.99 276.276C365.53 268.624 371.761 261.361 378.899 255.278C379.114 255.09 379.329 254.902 379.557 254.728C382.789 251.999 386.241 249.541 389.877 247.378C391.865 246.205 393.913 245.129 396.021 244.148C401.46 241.648 407.258 240.015 413.204 239.311H413.218C413.231 239.311 413.244 239.304 413.265 239.304C413.285 239.304 413.298 239.297 413.312 239.297C425.136 237.93 437.256 240.336 446.529 247.532C446.771 247.72 446.999 247.9 447.234 248.088Z" fill="#F0F0F0"/>
                        <path d="M357.513 279.786H357.68V279.799L357.721 279.786H368.377C365.201 279.243 362.032 278.821 358.856 279.431C358.782 279.444 358.714 279.458 358.641 279.478C358.318 279.538 357.996 279.619 357.674 279.706C357.654 279.712 357.627 279.719 357.607 279.726C357.577 279.734 357.55 279.747 357.526 279.766C357.509 279.768 357.493 279.775 357.479 279.786H357.513Z" fill="white"/>
                        <path d="M447.04 248.415C446.791 248.375 446.55 248.328 446.301 248.295H446.294C441.114 247.452 435.855 247.187 430.616 247.504C430.354 247.518 430.085 247.538 429.817 247.551C422.544 248.057 415.393 249.682 408.618 252.369C408.612 252.369 408.612 252.369 408.612 252.375C408.538 252.402 408.464 252.429 408.397 252.456C406.819 253.092 405.261 253.789 403.737 254.539C400.82 255.895 398.135 257.699 395.78 259.886C393.894 261.743 392.467 264.012 391.61 266.513C391.523 266.768 391.435 267.015 391.355 267.27C391.294 267.471 391.234 267.679 391.173 267.88C390.381 270.687 389.891 273.649 388.427 276.215C388.019 276.931 387.523 277.593 386.95 278.185C386.358 278.8 385.69 279.338 384.962 279.786H383.27C384.196 279.387 385.055 278.847 385.815 278.185C386.406 277.676 386.924 277.087 387.353 276.436C389.018 273.93 389.528 270.875 390.307 268.027C390.435 267.565 390.569 267.116 390.717 266.667C391.492 264.21 392.791 261.949 394.524 260.04C396.757 257.739 399.366 255.834 402.239 254.405C404.052 253.454 405.914 252.592 407.826 251.819C408.074 251.712 408.323 251.618 408.571 251.524C420.64 246.837 433.746 245.459 446.529 247.531C446.778 247.565 447.02 247.611 447.268 247.652C447.772 247.739 447.543 248.502 447.04 248.415Z" fill="white"/>
                        <path d="M407.937 252.18C407.145 249.782 407.232 247.182 408.184 244.843C409.136 242.504 410.89 240.579 413.133 239.411C413.588 239.176 413.974 239.87 413.519 240.105C411.429 241.189 409.795 242.982 408.913 245.162C408.031 247.342 407.959 249.765 408.71 251.993C408.873 252.477 408.099 252.661 407.937 252.18H407.937Z" fill="white"/>
                        <path d="M391.391 266.402C395.988 268.766 401.309 269.314 406.293 267.937C406.787 267.8 406.974 268.572 406.481 268.709C401.292 270.132 395.755 269.55 390.977 267.08C390.522 266.844 390.938 266.168 391.391 266.402Z" fill="white"/>
                        <path d="M430.579 247.258C430.692 248.249 431.049 249.197 431.62 250.017C432.191 250.836 432.956 251.501 433.848 251.952C434.306 252.182 433.889 252.858 433.434 252.63C432.451 252.127 431.606 251.391 430.974 250.488C430.341 249.584 429.94 248.539 429.806 247.445C429.784 247.343 429.803 247.237 429.857 247.148C429.911 247.059 429.998 246.994 430.098 246.966C430.201 246.942 430.309 246.959 430.399 247.013C430.489 247.068 430.553 247.156 430.579 247.258Z" fill="white"/>
                        <path d="M386.234 263.187L379.63 265.358L368.096 240.976L377.842 237.771L386.234 263.187Z" fill="#9F616A"/>
                        <path d="M390.945 268.726L390.495 267.365L389.314 263.781L388.508 261.342L386.305 262.065L385.849 262.032L379.799 261.623L378.993 261.57L377.798 261.489L376.562 261.402L373.111 266.407H373.104C371.814 266.826 370.62 267.497 369.592 268.381C368.564 269.264 367.722 270.342 367.115 271.553C367.041 271.7 366.974 271.848 366.907 271.995C366.74 272.356 366.599 272.727 366.484 273.108C365.961 274.749 365.864 276.497 366.202 278.186C366.288 278.605 366.398 279.019 366.531 279.426L366.551 279.493L366.631 279.741L367.115 279.58L371.358 278.186L386.225 273.302L389.173 272.33L390.079 272.029H390.086L391.845 271.452L390.945 268.726Z" fill="#2F2E41"/>
                        <path d="M323.64 268.921L316.688 268.92L313.38 242.16L323.642 242.161L323.64 268.921Z" fill="#9F616A"/>
                        <path d="M312.514 151.61L309.432 156.93C309.432 156.93 306.045 157.853 307.152 168.869C307.933 176.648 308.187 211.476 310.154 234.103C310.973 243.519 312.089 250.823 313.664 253.183L314.633 254.049L324.75 255.014L325.005 254.925L328.72 228.743C329.387 224.043 329.287 219.266 328.425 214.598L327.753 207.227L337.068 169.909C337.068 169.909 346.554 193.827 352.597 216.608C354.052 222.092 359.578 225.579 361.673 230.285C362.375 231.862 363.064 233.39 363.737 234.855C368.168 244.508 370.389 251.536 372.07 252.119H373.413L381.471 249.439L383.056 245.463L370.727 209.238L361.495 150.748C343.904 141.309 327.403 140.259 312.514 151.61Z" fill="#2F2E41"/>
                        <path d="M362.904 72.7999C362.297 71.4651 361.583 70.1812 360.769 68.9606C358.909 66.0675 356.323 63.7093 353.269 62.1196L350.623 61.5367L345.883 60.4914L343.385 57.6974L339.289 53.1211H325.188L323.301 57.6974L321.717 61.5367L321.038 63.1716L308.965 69.1951C308.959 69.1951 308.959 69.1951 308.952 69.2018C309.113 70.4079 309.272 71.6072 309.429 72.7999C309.771 75.3929 310.093 77.9547 310.396 80.4851C310.55 81.7716 310.698 83.0514 310.839 84.3244C311.289 88.3178 311.676 92.2419 312 96.0969C312.289 99.5408 312.52 102.936 312.692 106.281C313.112 113.88 313.143 121.494 312.786 129.096C312.692 130.885 314.471 132.922 314.33 134.671C314.095 137.525 311.886 140.058 311.497 142.785C311.255 144.46 311.362 146.242 310.939 147.823C310.822 148.286 310.646 148.732 310.416 149.15C310.416 149.157 310.409 149.157 310.409 149.163C305.574 157.78 309.368 153.666 308.918 155.602L309.133 155.656C309.234 155.683 309.543 155.763 310.04 155.877C312.88 156.554 324.59 145.585 332.453 145.585C337.174 145.585 349.67 153.331 353.853 153.894C357.163 154.336 360.118 154.738 361.877 153.19C362.388 152.739 362.778 152.168 363.012 151.529L363.032 151.468L363.025 151.408L362.857 149.163L362.757 147.823L361.32 128.593C360.517 127.6 360.01 126.403 359.856 125.137C359.702 123.871 359.906 122.587 360.447 121.431L360.742 120.808L359.655 106.281L359.453 103.568L359.379 102.65V102.643L358.856 95.6278L360.118 91.7952V91.7885L362.575 84.3244L363.838 80.4851L364.63 78.073L364.684 77.9122C364.261 76.1537 363.665 74.4413 362.904 72.7999Z" fill="#6A64F1"/>
                        <path d="M375.154 142.089L361.618 107.179L355.331 94.4321L367.42 87.7676L377.157 104.886L383.684 140.653C384.712 141.353 385.506 142.344 385.965 143.497C386.424 144.651 386.527 145.916 386.26 147.128C385.994 148.341 385.37 149.446 384.469 150.302C383.568 151.158 382.431 151.726 381.205 151.932C379.978 152.139 378.718 151.975 377.585 151.461C376.453 150.947 375.5 150.107 374.85 149.049C374.199 147.991 373.881 146.763 373.935 145.523C373.989 144.282 374.414 143.087 375.154 142.089H375.154Z" fill="#9F616A"/>
                        <path d="M257.165 128.205L284.857 102.955L294.481 92.4844L305.09 101.309L292.635 116.573L261.6 135.616C261.319 136.825 260.682 137.923 259.771 138.769C258.86 139.614 257.717 140.168 256.488 140.36C255.259 140.552 254 140.373 252.874 139.846C251.748 139.319 250.805 138.467 250.167 137.402C249.529 136.336 249.225 135.104 249.295 133.865C249.364 132.625 249.802 131.435 250.555 130.446C251.307 129.458 252.338 128.716 253.516 128.317C254.694 127.917 255.965 127.878 257.165 128.205H257.165Z" fill="#9F616A"/>
                        <path d="M314.33 84.3255L314.277 80.4862L314.176 72.8009L314.136 69.8193L314.021 69.7389C313.396 69.3296 312.687 69.0641 311.947 68.9617C311.295 68.8539 310.631 68.8539 309.979 68.9617C309.636 69.0147 309.297 69.0931 308.965 69.1962C308.959 69.1962 308.959 69.1962 308.952 69.2029C306.961 69.9159 305.204 71.1577 303.869 72.7942L303.862 72.8009C301.848 75.1911 300.064 77.7641 298.531 80.4862C297.772 81.7726 297.047 83.0725 296.368 84.3255C293.803 89.0894 291.957 93.2168 291.923 93.2905L284.255 103.227L284.363 103.408L286.048 106.282L292.226 116.822L293.206 118.497L295.71 117.164C298.63 115.609 300.932 113.109 302.237 110.075L303.13 106.671L303.459 106.282L312 96.0979L314.444 93.1766L314.33 84.3255Z" fill="#6A64F1"/>
                        <path d="M343.597 40.0096C344.74 32.9779 339.955 26.3525 332.908 25.2114C325.861 24.0704 319.221 28.8456 318.078 35.8773C316.934 42.9091 321.72 49.5344 328.767 50.6755C335.813 51.8166 342.453 47.0413 343.597 40.0096Z" fill="#9F616A"/>
                        <path d="M318.342 29.4869C317.767 27.4805 316.618 25.7607 317.193 25.7607C317.767 25.7607 318.054 24.3275 318.054 24.3275C318.054 24.3275 318.629 24.0408 318.916 24.3275C319.203 24.6141 319.491 22.321 319.491 22.321C319.491 22.321 319.778 21.4611 320.065 22.0344C320.352 22.6077 320.352 22.321 320.64 21.4611C320.927 20.6012 322.363 20.0279 322.363 20.0279C322.363 20.0279 327.821 20.3146 328.683 19.168C329.545 18.0215 339.311 18.8814 341.322 20.3146C343.333 21.7477 351.255 24.3099 346.554 32.3503C349.24 37.0405 345.23 45.4058 344.194 46.3984C342.556 47.9679 341.422 48.5338 333.67 50.073C332.152 50.3743 328.425 37.7105 328.425 37.7105C328.425 37.7105 318.916 31.4934 318.342 29.4869Z" fill="#2F2E41"/>
                        <path d="M324.06 267.873L323.644 267.705L316.164 264.663L315.015 264.201L310.167 267.873H310.161C307.422 267.876 304.796 268.964 302.859 270.897C300.923 272.83 299.835 275.451 299.833 278.185V278.52H326.377V267.873H324.06Z" fill="#2F2E41"/>
                        <path d="M402.078 278.983C402.079 279.088 402.058 279.192 402.018 279.29C401.979 279.387 401.92 279.475 401.846 279.55C401.771 279.625 401.683 279.684 401.586 279.725C401.489 279.765 401.385 279.786 401.279 279.787H264.769C264.557 279.787 264.353 279.703 264.202 279.552C264.052 279.402 263.967 279.199 263.967 278.986C263.967 278.774 264.052 278.57 264.202 278.42C264.353 278.27 264.557 278.186 264.769 278.186H401.279C401.491 278.186 401.694 278.27 401.844 278.42C401.993 278.569 402.078 278.772 402.078 278.983Z" fill="#CCCCCC"/>
                        <path d="M370.112 79.8098L365.304 78.2376L358.667 71.0785L355.24 67.3789L353.081 65.0558L352.162 64.0611L343.475 60.9932L337.607 58.9176L334.019 62.9592L332.309 64.8854L335.737 71.4336L337.815 75.4136L342.336 84.0445L352.502 94.4739L355.03 97.0669L356.478 98.5599L356.489 98.5729L356.687 98.7706L375.908 94.0276L376.511 93.8792L376.289 92.647L376.214 92.2007C376.176 91.9776 376.13 91.7561 376.084 91.5347C375.183 87.2127 373.136 83.194 370.112 79.8098Z" fill="#6A64F1"/>
                        </svg>
                        {loading ? <Loading/> :
                        (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="formbold-input-wrapp formbold-mb-3">
                                <label htmlFor="type" className="formbold-form-label"> Product Type </label>
                                <input
                                type="text"
                                name="type"
                                id="type"
                                placeholder="Product type"
                                className="formbold-form-input"
                                {...register("type")}
                                />
                            </div>
                            <div className="error-notice">
                            {errors.type && (
                                    <div id="error-file" className="layout-content-group error-form">
                                        {errors.type.message}
                                    </div>
                                )}
                            </div>
                            <div className="formbold-mb-3">
                                <button id="submit-button" type="submit" className="formbold-btn">Submit</button>
                            </div>
                        </form>
                        )}  
                    </div>
                </div>
            </div>
        }
        />
    )
};

export default AddType;